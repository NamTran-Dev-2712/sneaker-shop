using MediatR;
using Microsoft.EntityFrameworkCore;

public class DeliverStoreOrderCommandHandler
    : IRequestHandler<DeliverStoreOrderCommand, DeliverStoreOrderResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeliverStoreOrderCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<DeliverStoreOrderResult> Handle(
        DeliverStoreOrderCommand command,
        CancellationToken cancellationToken
    )
    {
        var order = await _unitOfWork
            .Orders.Query()
            .Include(o => o.OrderFulfillment)
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

        if (order.OrderFulfillment == null)
        {
            throw new NotFoundException("Không tìm thấy thông tin giao/nhận của đơn hàng.");
        }

        var isDeliveryFlow = order.OrderFulfillment.Type == FulfillmentType.DELIVERY;
        var isValidStatus =
            (isDeliveryFlow && order.Status == OrderStatus.SHIPPED)
            || (!isDeliveryFlow && order.Status == OrderStatus.PACKED);

        if (!isValidStatus)
        {
            throw new BadException(
                "Không thể hoàn tất đơn hàng ở trạng thái hiện tại. DELIVERY phải ở SHIPPED, PICKUP phải ở PACKED."
            );
        }

        order.Deliver();
        order.StaffId = command.StaffAccountId;

        var payment = order.Payments.OrderByDescending(x => x.UpdatedAt).FirstOrDefault();
        if (
            payment != null
            && payment.Method == PaymentMethod.COD
            && payment.Status == PaymentStatus.PENDING
        )
        {
            payment.MarkAsPaid();
            _unitOfWork.Payments.Update(payment);
        }

        _unitOfWork.Orders.Update(order);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DeliverStoreOrderResult
        {
            OrderId = order.Id,
            Status = order.Status.ToString(),
            UpdatedAt = order.UpdatedAt,
        };
    }
}
