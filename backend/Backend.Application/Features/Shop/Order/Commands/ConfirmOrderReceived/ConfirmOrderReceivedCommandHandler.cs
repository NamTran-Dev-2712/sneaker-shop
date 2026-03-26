using MediatR;
using Microsoft.EntityFrameworkCore;

public class ConfirmOrderReceivedCommandHandler
    : IRequestHandler<ConfirmOrderReceivedCommand, ConfirmOrderReceivedResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public ConfirmOrderReceivedCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ConfirmOrderReceivedResult> Handle(
        ConfirmOrderReceivedCommand command,
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

        if (order.CustomerId != command.CustomerId)
        {
            throw new ForbiddenException("Bạn không có quyền xác nhận đơn hàng này.");
        }

        if (order.OrderFulfillment == null)
        {
            throw new NotFoundException("Không tìm thấy thông tin giao/nhận của đơn hàng.");
        }

        if (
            order.OrderFulfillment.Type != FulfillmentType.DELIVERY
            || order.Status != OrderStatus.SHIPPED
        )
        {
            throw new BadException(
                "Chỉ có thể xác nhận đã nhận hàng cho đơn DELIVERY ở trạng thái SHIPPED."
            );
        }

        order.Deliver();

        var payment = order.Payments.OrderByDescending(x => x.UpdatedAt).FirstOrDefault();
        if (
            payment != null
            && payment.Method == PaymentMethod.COD
            && payment.Status == PaymentStatus.PENDING
        )
        {
            payment.MarkAsPaid();

            var hasIncomeEntry = await _unitOfWork.FinanceLedgerEntries.ExistsBySourceAsync(
                FinanceEntrySourceType.ORDER_PAYMENT,
                order.Id,
                cancellationToken
            );

            if (!hasIncomeEntry)
            {
                await _unitOfWork.FinanceLedgerEntries.AddAsync(
                    new FinanceLedgerEntry
                    {
                        Status = FinanceEntryStatus.INCOME,
                        Amount = payment.Amount,
                        Category = "ORDER",
                        Description = $"Thanh toán COD đơn hàng ORD-{order.Id:D6}",
                        SourceType = FinanceEntrySourceType.ORDER_PAYMENT,
                        SourceId = order.Id,
                        StoreId = order.StoreId,
                        CreatedBy = order.CreatedBy,
                        OccurredAt = payment.PaidAt.HasValue
                            ? DateTime.SpecifyKind(payment.PaidAt.Value, DateTimeKind.Utc)
                            : DateTime.UtcNow,
                    },
                    cancellationToken
                );
            }

            _unitOfWork.Payments.Update(payment);
        }

        _unitOfWork.Orders.Update(order);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new ConfirmOrderReceivedResult
        {
            OrderId = order.Id,
            Status = order.Status.ToString(),
            UpdatedAt = order.UpdatedAt,
        };
    }
}
