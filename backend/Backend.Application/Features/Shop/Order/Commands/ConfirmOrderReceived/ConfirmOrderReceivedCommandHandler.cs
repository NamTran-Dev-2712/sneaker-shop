using System.Data;
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
        return await _unitOfWork.ExecuteInTransactionAsync(
            async () =>
            {
                var order = await _unitOfWork
                    .Orders.Query()
                    .Include(o => o.OrderFulfillment)
                    .Include(o => o.Payments)
                    .FirstOrDefaultAsync(o => o.Id == command.OrderId, cancellationToken);

                if (order == null)
                    throw new NotFoundException("Không tìm thấy đơn hàng.");

                if (order.CustomerId != command.CustomerId)
                    throw new ForbiddenException("Bạn không có quyền xác nhận đơn hàng này.");

                if (order.OrderFulfillment == null)
                    throw new NotFoundException("Không tìm thấy thông tin giao/nhận của đơn hàng.");

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

                // COD payment: mark as paid upon delivery confirmation
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

                // ============ Loyalty Points Earn (1 point per 1,000₫ of order.Total) ============
                await EarnLoyaltyPointsAsync(order, cancellationToken);

                _unitOfWork.Orders.Update(order);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return new ConfirmOrderReceivedResult
                {
                    OrderId = order.Id,
                    Status = order.Status.ToString(),
                    UpdatedAt = order.UpdatedAt,
                };
            },
            IsolationLevel.ReadCommitted
        );
    }

    private async Task EarnLoyaltyPointsAsync(Order order, CancellationToken cancellationToken)
    {
        if (!order.CustomerId.HasValue || order.Total <= 0)
            return;

        long earnedPoints = (long)Math.Floor((double)order.Total / 1000);
        if (earnedPoints <= 0)
            return;

        // Idempotency guard: skip if this order already has an EARN transaction
        var alreadyEarned = await _unitOfWork
            .LoyaltyTransactions.Query()
            .AnyAsync(
                lt => lt.OrderId == order.Id && lt.TxnType == LoyaltyTxnType.EARN,
                cancellationToken
            );

        if (alreadyEarned)
            return;

        var loyaltyAccount = await _unitOfWork
            .LoyaltyAccounts.Query()
            .FirstOrDefaultAsync(la => la.CustomerId == order.CustomerId.Value, cancellationToken);

        if (loyaltyAccount == null)
        {
            loyaltyAccount = new LoyaltyAccount { CustomerId = order.CustomerId.Value };
            await _unitOfWork.LoyaltyAccounts.AddAsync(loyaltyAccount, cancellationToken);
            // Flush within the transaction to obtain the generated PK
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        loyaltyAccount.EarnPoints(earnedPoints);
        _unitOfWork.LoyaltyAccounts.Update(loyaltyAccount);

        await _unitOfWork.LoyaltyTransactions.AddAsync(
            LoyaltyTransaction.CreateEarn(
                loyaltyAccount.Id,
                earnedPoints,
                $"Tích điểm đơn hàng ORD-{order.Id:D6}",
                order.Id,
                order.CreatedBy
            ),
            cancellationToken
        );
    }
}
