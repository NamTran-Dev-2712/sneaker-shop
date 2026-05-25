using System.Data;
using MediatR;

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
        return await _unitOfWork.ExecuteInTransactionAsync(
            async () => await ProcessMarkPaidAsync(command, cancellationToken),
            IsolationLevel.ReadCommitted
        );
    }

    private async Task<MarkStoreOrderPaidResult> ProcessMarkPaidAsync(
        MarkStoreOrderPaidCommand command,
        CancellationToken cancellationToken
    )
    {
        // SELECT ... FOR UPDATE — row-level lock prevents concurrent double-payment
        var order = await _unitOfWork.Orders.GetByIdWithLockAsync(
            command.OrderId,
            cancellationToken
        );

        if (order == null)
            throw new NotFoundException("Không tìm thấy đơn hàng.");

        if (order.StoreId != command.StoreId)
            throw new ForbiddenException("Bạn không có quyền xử lý đơn hàng này.");

        if (order.Status != OrderStatus.CONFIRMED)
            throw new BadException(
                "Chỉ có thể ghi nhận thanh toán cho đơn hàng ở trạng thái CONFIRMED."
            );

        var payment = order.Payments.OrderByDescending(x => x.UpdatedAt).FirstOrDefault();
        if (payment == null)
            throw new NotFoundException("Đơn hàng chưa có thông tin thanh toán.");

        if (payment.Method == PaymentMethod.COD)
            throw new BadException(
                "Đơn COD không có bước xác nhận thanh toán trung gian. Thanh toán được ghi nhận khi hoàn tất giao/nhận."
            );

        if (payment.Method == PaymentMethod.VNPAY)
            throw new BadException(
                "Đơn VNPay được cập nhật tự động theo callback từ cổng thanh toán, không hỗ trợ xác nhận tay."
            );

        payment.MarkAsPaid();
        order.MarkAsPaid();
        order.StaffId = command.StaffAccountId;

        // Finance entry — inside same transaction, fully atomic
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
                    Description = $"Thanh toán đơn hàng ORD-{order.Id:D6}",
                    SourceType = FinanceEntrySourceType.ORDER_PAYMENT,
                    SourceId = order.Id,
                    StoreId = order.StoreId,
                    CreatedBy = command.StaffAccountId,
                    OccurredAt = payment.PaidAt ?? DateTime.UtcNow,
                },
                cancellationToken
            );
        }

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
