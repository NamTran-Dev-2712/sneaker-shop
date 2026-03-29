using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public class VnPayPendingPaymentCleanupService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<VnPayPendingPaymentCleanupService> _logger;

    private readonly bool _enabled;
    private readonly TimeSpan _scanInterval;
    private readonly int _autoCancelAfterMinutes;
    private readonly int _batchSize;

    public VnPayPendingPaymentCleanupService(
        IServiceScopeFactory scopeFactory,
        IConfiguration configuration,
        ILogger<VnPayPendingPaymentCleanupService> logger
    )
    {
        _scopeFactory = scopeFactory;
        _logger = logger;

        var vnpayEnabled = bool.TryParse(configuration["VnPay:Enabled"], out var v) && v;
        var cleanupEnabled =
            !bool.TryParse(configuration["VnPay:PendingCleanupEnabled"], out var c) || c;

        _enabled = vnpayEnabled && cleanupEnabled;

        var scanSeconds = int.TryParse(
            configuration["VnPay:PendingCleanupIntervalSeconds"],
            out var s
        )
            ? Math.Clamp(s, 15, 3600)
            : 60;
        _scanInterval = TimeSpan.FromSeconds(scanSeconds);

        var expireMinutes = int.TryParse(configuration["VnPay:ExpireInMinutes"], out var e)
            ? Math.Clamp(e, 1, 60)
            : 15;

        _autoCancelAfterMinutes = int.TryParse(
            configuration["VnPay:AutoCancelAfterMinutes"],
            out var timeoutMinutes
        )
            ? Math.Clamp(timeoutMinutes, 2, 240)
            : expireMinutes + 2;

        _batchSize = int.TryParse(configuration["VnPay:PendingCleanupBatchSize"], out var b)
            ? Math.Clamp(b, 1, 500)
            : 100;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_enabled)
        {
            _logger.LogInformation(
                "VNPay pending-payment cleanup is disabled (VnPay:Enabled or cleanup flag is off)."
            );
            return;
        }

        _logger.LogInformation(
            "VNPay pending-payment cleanup started. Interval={Interval}s, AutoCancelAfter={Timeout}m, BatchSize={BatchSize}",
            _scanInterval.TotalSeconds,
            _autoCancelAfterMinutes,
            _batchSize
        );

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var affected = await CleanupExpiredPendingPaymentsAsync(stoppingToken);

                if (affected > 0)
                {
                    _logger.LogInformation(
                        "VNPay cleanup released inventory and cancelled {Count} expired pending order(s).",
                        affected
                    );
                }
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "VNPay pending-payment cleanup failed.");
            }

            await Task.Delay(_scanInterval, stoppingToken);
        }
    }

    private async Task<int> CleanupExpiredPendingPaymentsAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

        var expiredBeforeUtc = DateTime.UtcNow.AddMinutes(-_autoCancelAfterMinutes);

        return await unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            var pendingPayments = await unitOfWork
                .Payments.Query()
                .Include(p => p.Order)
                    .ThenInclude(o => o!.OrderItems)
                .Where(p =>
                    p.Method == PaymentMethod.VNPAY
                    && p.Status == PaymentStatus.PENDING
                    && p.CreatedAt <= expiredBeforeUtc
                    && p.Order != null
                    && p.Order.Status == OrderStatus.PLACED
                )
                .OrderBy(p => p.CreatedAt)
                .Take(_batchSize)
                .ToListAsync(cancellationToken);

            if (!pendingPayments.Any())
            {
                return 0;
            }

            var affected = 0;

            foreach (var payment in pendingPayments)
            {
                var order = payment.Order;
                if (order == null || !order.StoreId.HasValue)
                {
                    continue;
                }

                foreach (var item in order.OrderItems)
                {
                    var inventory = await unitOfWork
                        .Inventories.Query()
                        .FirstOrDefaultAsync(
                            i =>
                                i.StoreId == order.StoreId.Value
                                && i.SellableItemId == item.SellableItemId,
                            cancellationToken
                        );

                    if (inventory == null || inventory.Reserved < item.Quantity)
                    {
                        continue;
                    }

                    inventory.ReleaseReservation(item.Quantity);
                    unitOfWork.Inventories.Update(inventory);
                }

                payment.MarkAsFailed();
                order.Note = string.IsNullOrWhiteSpace(order.Note)
                    ? "[VNPAY_TIMEOUT] Tự động hủy do quá hạn thanh toán."
                    : $"{order.Note}\n[VNPAY_TIMEOUT] Tự động hủy do quá hạn thanh toán.";
                order.Cancel();

                unitOfWork.Payments.Update(payment);
                unitOfWork.Orders.Update(order);
                affected++;
            }

            await unitOfWork.SaveChangesAsync(cancellationToken);
            return affected;
        });
    }
}
