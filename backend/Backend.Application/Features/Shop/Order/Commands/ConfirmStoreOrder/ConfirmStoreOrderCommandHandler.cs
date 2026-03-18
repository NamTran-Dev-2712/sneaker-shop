using MediatR;

public class ConfirmStoreOrderCommandHandler
    : IRequestHandler<ConfirmStoreOrderCommand, ConfirmStoreOrderResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public ConfirmStoreOrderCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ConfirmStoreOrderResult> Handle(
        ConfirmStoreOrderCommand command,
        CancellationToken cancellationToken
    )
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(command.OrderId, cancellationToken);
        if (order == null)
        {
            throw new NotFoundException("Không tìm thấy đơn hàng.");
        }

        if (order.StoreId != command.StoreId)
        {
            throw new ForbiddenException("Bạn không có quyền xử lý đơn hàng này.");
        }

        if (order.Status != OrderStatus.PLACED)
        {
            throw new BadException("Chỉ có thể xác nhận đơn hàng đang ở trạng thái PLACED.");
        }

        order.Confirm(command.StaffAccountId);
        _unitOfWork.Orders.Update(order);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new ConfirmStoreOrderResult
        {
            OrderId = order.Id,
            Status = order.Status.ToString(),
            UpdatedAt = order.UpdatedAt,
        };
    }
}
