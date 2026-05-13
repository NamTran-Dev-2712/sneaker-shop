using System.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class CancelStoreOrderCommandHandler
    : IRequestHandler<CancelStoreOrderCommand, CancelStoreOrderResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public CancelStoreOrderCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CancelStoreOrderResult> Handle(
        CancelStoreOrderCommand command,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork.ExecuteInTransactionAsync(
            async () =>
            {
                var order = await _unitOfWork
                    .Orders.Query()
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.Id == command.OrderId, cancellationToken);

                if (order == null)
                {
                    throw new NotFoundException("Không tìm thấy đơn hàng.");
                }

                if (order.StoreId != command.StoreId)
                {
                    throw new ForbiddenException("Bạn không có quyền xử lý đơn hàng này.");
                }

                if (!order.CanCancel())
                {
                    throw new BadException(
                        "Chỉ có thể hủy đơn hàng ở trạng thái PLACED hoặc CONFIRMED."
                    );
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

                    inventory.ReleaseReservation(item.Quantity);
                    _unitOfWork.Inventories.Update(inventory);
                }

                var reason = command.Reason?.Trim();
                if (!string.IsNullOrWhiteSpace(reason))
                {
                    order.Note = string.IsNullOrWhiteSpace(order.Note)
                        ? $"[STAFF_CANCEL] {reason}"
                        : $"{order.Note}\n[STAFF_CANCEL] {reason}";
                }

                order.Cancel();
                order.StaffId = command.StaffAccountId;
                _unitOfWork.Orders.Update(order);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return new CancelStoreOrderResult
                {
                    OrderId = order.Id,
                    Status = order.Status.ToString(),
                    Reason = reason,
                    UpdatedAt = order.UpdatedAt,
                };
            },
            IsolationLevel.Serializable
        );
    }
}
