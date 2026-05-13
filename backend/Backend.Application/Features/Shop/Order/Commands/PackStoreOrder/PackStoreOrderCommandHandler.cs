using System.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class PackStoreOrderCommandHandler
    : IRequestHandler<PackStoreOrderCommand, PackStoreOrderResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public PackStoreOrderCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<PackStoreOrderResult> Handle(
        PackStoreOrderCommand command,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork.ExecuteInTransactionAsync(
            async () =>
            {
                var order = await _unitOfWork
                    .Orders.Query()
                    .Include(o => o.OrderItems)
                    .Include(o => o.Payments)
                    .FirstOrDefaultAsync(o => o.Id == command.OrderId, cancellationToken);

                if (order == null)
                {
                    throw new NotFoundException("Không tìm thấy đơn hàng.");
                }

                if (order.StoreId != command.StoreId)
                {
                    throw new ForbiddenException("Bạn không có quyền xử lý đơn hàng này.");
                }

                var payment = order.Payments.OrderByDescending(x => x.UpdatedAt).FirstOrDefault();
                if (payment == null)
                {
                    throw new NotFoundException("Đơn hàng chưa có thông tin thanh toán.");
                }

                var isCodPayment = payment.Method == PaymentMethod.COD;

                if (isCodPayment && order.Status != OrderStatus.CONFIRMED)
                {
                    throw new BadException(
                        "Đơn COD chỉ có thể đóng gói khi ở trạng thái CONFIRMED."
                    );
                }

                if (!isCodPayment)
                {
                    if (order.Status != OrderStatus.CONFIRMED && order.Status != OrderStatus.PAID)
                    {
                        throw new BadException(
                            "Đơn đã thanh toán chỉ có thể đóng gói khi ở trạng thái CONFIRMED hoặc PAID."
                        );
                    }

                    if (payment.Status != PaymentStatus.PAID)
                    {
                        throw new BadException(
                            "Đơn trả trước cần xác nhận thanh toán thành công trước khi đóng gói."
                        );
                    }
                }

                foreach (var item in order.OrderItems)
                {
                    var inventory = await _unitOfWork
                        .Inventories.Query()
                        .FirstOrDefaultAsync(
                            i =>
                                i.StoreId == command.StoreId
                                && i.SellableItemId == item.SellableItemId,
                            cancellationToken
                        );

                    if (inventory == null)
                    {
                        throw new NotFoundException(
                            $"Không tìm thấy tồn kho cho sản phẩm {item.ProductNameSnapshot}."
                        );
                    }

                    inventory.FulfillReservation(item.Quantity);
                    _unitOfWork.Inventories.Update(inventory);
                }

                order.Pack();
                order.StaffId = command.StaffAccountId;
                _unitOfWork.Orders.Update(order);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return new PackStoreOrderResult
                {
                    OrderId = order.Id,
                    Status = order.Status.ToString(),
                    UpdatedAt = order.UpdatedAt,
                };
            },
            IsolationLevel.Serializable
        );
    }
}
