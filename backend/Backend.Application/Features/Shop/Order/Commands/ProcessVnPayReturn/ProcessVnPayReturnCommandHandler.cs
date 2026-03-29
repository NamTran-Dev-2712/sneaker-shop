using MediatR;
using Microsoft.EntityFrameworkCore;

public class ProcessVnPayReturnCommandHandler
    : IRequestHandler<ProcessVnPayReturnCommand, ProcessVnPayReturnResult>
{
    private const string VN_PAY_PROVIDER = "VNPAY";

    private readonly IUnitOfWork _unitOfWork;
    private readonly IVnPayService _vnPayService;

    public ProcessVnPayReturnCommandHandler(IUnitOfWork unitOfWork, IVnPayService vnPayService)
    {
        _unitOfWork = unitOfWork;
        _vnPayService = vnPayService;
    }

    public async Task<ProcessVnPayReturnResult> Handle(
        ProcessVnPayReturnCommand command,
        CancellationToken cancellationToken
    )
    {
        var queryParams = command.QueryParams;

        queryParams.TryGetValue("vnp_TxnRef", out var txnRef);

        if (string.IsNullOrWhiteSpace(txnRef))
        {
            return new ProcessVnPayReturnResult
            {
                Status = "INVALID_DATA",
                VnPayTxnRef = string.Empty,
                Message = "Thiếu mã giao dịch VNPay.",
            };
        }

        if (!_vnPayService.ValidateSignature(queryParams))
        {
            return new ProcessVnPayReturnResult
            {
                Status = "INVALID_SIGNATURE",
                VnPayTxnRef = txnRef,
                Message = "Chữ ký VNPay không hợp lệ.",
            };
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
            return new ProcessVnPayReturnResult
            {
                Status = "NOT_FOUND",
                VnPayTxnRef = txnRef,
                Message = "Không tìm thấy giao dịch thanh toán tương ứng.",
            };
        }

        if (
            !TryResolveAmount(queryParams, out var callbackAmount)
            || callbackAmount != payment.Amount
        )
        {
            return new ProcessVnPayReturnResult
            {
                OrderId = payment.OrderId,
                Status = "AMOUNT_MISMATCH",
                VnPayTxnRef = txnRef,
                PaymentStatus = payment.Status.ToString(),
                Message = "Số tiền thanh toán không khớp.",
            };
        }

        queryParams.TryGetValue("vnp_ResponseCode", out var responseCode);
        queryParams.TryGetValue("vnp_TransactionStatus", out var transactionStatus);

        var isSuccess = _vnPayService.IsPaymentSuccess(responseCode, transactionStatus);

        if (payment.Status == PaymentStatus.PAID)
        {
            return new ProcessVnPayReturnResult
            {
                OrderId = payment.OrderId,
                Status = "SUCCESS",
                VnPayTxnRef = txnRef,
                PaymentStatus = payment.Status.ToString(),
                Message = "Đơn hàng đã được thanh toán trước đó.",
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

            return new ProcessVnPayReturnResult
            {
                OrderId = payment.OrderId,
                Status = "FAILED",
                VnPayTxnRef = txnRef,
                PaymentStatus = payment.Status.ToString(),
                Message = "Thanh toán VNPay không thành công.",
            };
        }

        payment.MarkAsPaid();

        var order = payment.Order;
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

        return new ProcessVnPayReturnResult
        {
            OrderId = payment.OrderId,
            Status = "SUCCESS",
            VnPayTxnRef = txnRef,
            PaymentStatus = payment.Status.ToString(),
            Message = "Thanh toán VNPay thành công.",
        };
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
