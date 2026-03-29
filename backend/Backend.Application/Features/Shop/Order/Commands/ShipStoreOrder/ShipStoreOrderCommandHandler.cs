using System.Data;
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
        return await _unitOfWork.ExecuteInTransactionAsync(
            async () =>
            {
                var order = await _unitOfWork.Orders.GetByIdWithLockAsync(
                    command.OrderId,
                    cancellationToken
                );
                if (order == null)
                    throw new NotFoundException("Không tìm thấy đơn hàng.");

                if (order.StoreId != command.StoreId)
                    throw new ForbiddenException("Bạn không có quyền xử lý đơn hàng này.");

                if (order.Status != OrderStatus.PACKED)
                    throw new BadException("Chỉ có thể ship đơn hàng ở trạng thái PACKED.");

                var fulfillment = await _unitOfWork
                    .OrderFulfillments.Query()
                    .FirstOrDefaultAsync(f => f.OrderId == command.OrderId, cancellationToken);

                if (fulfillment == null)
                    throw new NotFoundException("Không tìm thấy thông tin giao hàng.");

                if (fulfillment.Type != FulfillmentType.DELIVERY)
                    throw new BadException("Chỉ đơn hàng giao hàng mới có thể ship.");

                fulfillment.Carrier = command.Carrier?.Trim();
                fulfillment.TrackingCode = command.TrackingCode?.Trim();
                order.Ship();
                order.StaffId = command.StaffAccountId;

                _unitOfWork.OrderFulfillments.Update(fulfillment);
                _unitOfWork.Orders.Update(order);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return new ShipStoreOrderResult
                {
                    OrderId = order.Id,
                    Status = order.Status.ToString(),
                    UpdatedAt = order.UpdatedAt,
                };
            },
            IsolationLevel.ReadCommitted
        );
    }
}
