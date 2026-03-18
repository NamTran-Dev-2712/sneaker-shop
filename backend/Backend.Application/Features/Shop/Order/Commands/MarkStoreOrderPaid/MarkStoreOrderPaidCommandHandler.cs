using MediatR;
using Microsoft.EntityFrameworkCore;

public class MarkStoreOrderPaidCommandHandler
    : IRequestHandler<MarkStoreOrderPaidCommand, MarkStoreOrderPaidResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public MarkStoreOrderPaidCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<MarkStoreOrderPaidResult> Handle(
        MarkStoreOrderPaidCommand command,
        CancellationToken cancellationToken
    )
    {
        var order = await _unitOfWork
            .Orders.Query()
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

        if (order.Status != OrderStatus.CONFIRMED)
        {
            throw new BadException(
                "Chỉ có thể ghi nhận thanh toán cho đơn hàng ở trạng thái CONFIRMED."
            );
        }

        var payment = order.Payments.OrderByDescending(x => x.UpdatedAt).FirstOrDefault();
        if (payment == null)
        {
            throw new NotFoundException("Đơn hàng chưa có thông tin thanh toán.");
        }

        if (payment.Method == PaymentMethod.COD)
        {
            throw new BadException(
                "Đơn COD không có bước xác nhận thanh toán trung gian. Thanh toán được ghi nhận khi hoàn tất giao/nhận."
            );
        }

        payment.MarkAsPaid();
        order.MarkAsPaid();
        order.StaffId = command.StaffAccountId;

        _unitOfWork.Payments.Update(payment);
        _unitOfWork.Orders.Update(order);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new MarkStoreOrderPaidResult
        {
            OrderId = order.Id,
            Status = order.Status.ToString(),
            PaymentStatus = payment.Status.ToString(),
            UpdatedAt = order.UpdatedAt,
        };
    }
}
