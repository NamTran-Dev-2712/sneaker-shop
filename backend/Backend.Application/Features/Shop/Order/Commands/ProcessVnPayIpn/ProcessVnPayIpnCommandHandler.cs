using MediatR;
using Microsoft.EntityFrameworkCore;

public class ProcessVnPayIpnCommandHandler
    : IRequestHandler<ProcessVnPayIpnCommand, ProcessVnPayIpnResult>
{
    private const string VN_PAY_PROVIDER = "VNPAY";

    private readonly IUnitOfWork _unitOfWork;
    private readonly IVnPayService _vnPayService;

    public ProcessVnPayIpnCommandHandler(IUnitOfWork unitOfWork, IVnPayService vnPayService)
    {
        _unitOfWork = unitOfWork;
        _vnPayService = vnPayService;
    }

    public async Task<ProcessVnPayIpnResult> Handle(
        ProcessVnPayIpnCommand command,
        CancellationToken cancellationToken
    )
    {
        var queryParams = command.QueryParams;

        if (!_vnPayService.ValidateSignature(queryParams))
        {
            return new ProcessVnPayIpnResult { RspCode = "97", Message = "Invalid signature" };
        }

        queryParams.TryGetValue("vnp_TxnRef", out var txnRef);
        if (string.IsNullOrWhiteSpace(txnRef))
        {
            return new ProcessVnPayIpnResult { RspCode = "01", Message = "Order not found" };
        }

        var payment = await _unitOfWork
            .Payments.Query()
            .Include(p => p.Order)
                .ThenInclude(o => o!.OrderItems)
            .FirstOrDefaultAsync(
                p => p.Provider == VN_PAY_PROVIDER && p.ProviderTxnId == txnRef,
                cancellationToken
            );

        if (payment == null)
        {
            return new ProcessVnPayIpnResult { RspCode = "01", Message = "Order not found" };
        }

        if (
            !TryResolveAmount(queryParams, out var callbackAmount)
            || callbackAmount != payment.Amount
        )
        {
            return new ProcessVnPayIpnResult { RspCode = "04", Message = "Invalid amount" };
        }

        queryParams.TryGetValue("vnp_ResponseCode", out var responseCode);
        queryParams.TryGetValue("vnp_TransactionStatus", out var transactionStatus);

        var isSuccess = _vnPayService.IsPaymentSuccess(responseCode, transactionStatus);

        if (payment.Status == PaymentStatus.PAID)
        {
            return new ProcessVnPayIpnResult
            {
                RspCode = "02",
                Message = "Order already confirmed",
            };
        }

        if (!isSuccess)
        {
            if (payment.Status == PaymentStatus.PENDING)
            {
                payment.MarkAsFailed();

                var failedOrder = payment.Order;
                if (failedOrder.Status == OrderStatus.PLACED)
                {
                    await ReleaseOrderReservationsAsync(failedOrder, cancellationToken);
                    failedOrder.Note = string.IsNullOrWhiteSpace(failedOrder.Note)
                        ? "[VNPAY_FAILED] Thanh toán thất bại hoặc quá hạn."
                        : $"{failedOrder.Note}\n[VNPAY_FAILED] Thanh toán thất bại hoặc quá hạn.";
                    failedOrder.Cancel();
                    _unitOfWork.Orders.Update(failedOrder);
                }

                _unitOfWork.Payments.Update(payment);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            return new ProcessVnPayIpnResult { RspCode = "00", Message = "Confirm Success" };
        }

        var order = payment.Order;
        if (order.Status == OrderStatus.CANCELLED)
        {
            return new ProcessVnPayIpnResult { RspCode = "00", Message = "Confirm Success" };
        }

        payment.MarkAsPaid();

        if (order.Status == OrderStatus.PLACED)
        {
            order.UpdateStatus(OrderStatus.CONFIRMED);
            _unitOfWork.Orders.Update(order);
        }

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
                    Description = $"Thanh toán VNPay đơn hàng ORD-{order.Id:D6}",
                    SourceType = FinanceEntrySourceType.ORDER_PAYMENT,
                    SourceId = order.Id,
                    StoreId = order.StoreId,
                    CreatedBy = order.CreatedBy,
                    OccurredAt = payment.PaidAt ?? DateTime.UtcNow,
                },
                cancellationToken
            );
        }

        _unitOfWork.Payments.Update(payment);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new ProcessVnPayIpnResult { RspCode = "00", Message = "Confirm Success" };
    }

    private static bool TryResolveAmount(
        IReadOnlyDictionary<string, string> queryParams,
        out decimal amount
    )
    {
        amount = 0;

        if (!queryParams.TryGetValue("vnp_Amount", out var rawAmount))
        {
            return false;
        }

        if (!long.TryParse(rawAmount, out var amountInSmallestUnit) || amountInSmallestUnit < 0)
        {
            return false;
        }

        amount = amountInSmallestUnit / 100m;
        return true;
    }

    private async Task ReleaseOrderReservationsAsync(
        Order order,
        CancellationToken cancellationToken
    )
    {
        if (!order.StoreId.HasValue || !order.OrderItems.Any())
        {
            return;
        }

        foreach (var item in order.OrderItems)
        {
            var inventory = await _unitOfWork
                .Inventories.Query()
                .FirstOrDefaultAsync(
                    i =>
                        i.StoreId == order.StoreId.Value && i.SellableItemId == item.SellableItemId,
                    cancellationToken
                );

            if (inventory == null || inventory.Reserved < item.Quantity)
            {
                continue;
            }

            inventory.ReleaseReservation(item.Quantity);
            _unitOfWork.Inventories.Update(inventory);
        }
    }
}
