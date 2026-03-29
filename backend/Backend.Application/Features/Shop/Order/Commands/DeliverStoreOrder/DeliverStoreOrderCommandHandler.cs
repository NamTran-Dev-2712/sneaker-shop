using System.Data;
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

                if (order.StoreId != command.StoreId)
                    throw new ForbiddenException("Bạn không có quyền xử lý đơn hàng này.");

                if (order.OrderFulfillment == null)
                    throw new NotFoundException("Không tìm thấy thông tin giao/nhận của đơn hàng.");

                if (
                    order.OrderFulfillment.Type != FulfillmentType.PICKUP
                    || order.Status != OrderStatus.PACKED
                )
                {
                    throw new BadException(
                        "Nhân viên chỉ có thể hoàn tất đơn PICKUP ở trạng thái PACKED. "
                            + "Đơn DELIVERY phải do khách hàng xác nhận đã nhận hàng."
                    );
                }

                order.Deliver();
                order.StaffId = command.StaffAccountId;

                // COD payment: mark as paid upon pickup delivery
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
                                CreatedBy = command.StaffAccountId,
                                OccurredAt = payment.PaidAt ?? DateTime.UtcNow,
                            },
                            cancellationToken
                        );
                    }

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
            },
            IsolationLevel.ReadCommitted
        );
    }
}
