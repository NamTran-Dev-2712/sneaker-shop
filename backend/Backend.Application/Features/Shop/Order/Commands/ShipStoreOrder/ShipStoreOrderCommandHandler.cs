using MediatR;
using Microsoft.EntityFrameworkCore;

public class ShipStoreOrderCommandHandler
    : IRequestHandler<ShipStoreOrderCommand, ShipStoreOrderResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public ShipStoreOrderCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ShipStoreOrderResult> Handle(
        ShipStoreOrderCommand command,
        CancellationToken cancellationToken
    )
    {
        var order = await _unitOfWork
            .Orders.Query()
            .Include(o => o.OrderFulfillment)
            .FirstOrDefaultAsync(o => o.Id == command.OrderId, cancellationToken);

        if (order == null)
        {
            throw new NotFoundException("Không tìm thấy đơn hàng.");
        }

        if (order.StoreId != command.StoreId)
        {
            throw new ForbiddenException("Bạn không có quyền xử lý đơn hàng này.");
        }

        if (order.Status != OrderStatus.PACKED)
        {
            throw new BadException(
                "Chỉ có thể bàn giao vận chuyển cho đơn hàng ở trạng thái PACKED."
            );
        }

        if (order.OrderFulfillment == null)
        {
            throw new NotFoundException("Không tìm thấy thông tin giao/nhận của đơn hàng.");
        }

        if (order.OrderFulfillment.Type != FulfillmentType.DELIVERY)
        {
            throw new BadException("Đơn hàng PICKUP không thể chuyển sang trạng thái SHIPPED.");
        }

        if (
            !string.IsNullOrWhiteSpace(command.Carrier)
            && !string.IsNullOrWhiteSpace(command.TrackingCode)
        )
        {
            order.OrderFulfillment.UpdateShippingInfo(
                command.Carrier.Trim(),
                command.TrackingCode.Trim()
            );
            _unitOfWork.OrderFulfillments.Update(order.OrderFulfillment);
        }

        order.Ship();
        order.StaffId = command.StaffAccountId;
        _unitOfWork.Orders.Update(order);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new ShipStoreOrderResult
        {
            OrderId = order.Id,
            Status = order.Status.ToString(),
            Carrier = order.OrderFulfillment.Carrier,
            TrackingCode = order.OrderFulfillment.TrackingCode,
            UpdatedAt = order.UpdatedAt,
        };
    }
}
