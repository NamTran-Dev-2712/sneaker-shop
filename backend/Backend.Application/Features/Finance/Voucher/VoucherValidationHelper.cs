/// <summary>
/// Shared voucher validation logic — used by ValidateVoucherQueryHandler (dry-run preview)
/// AND CreateOrderCommandHandler (atomic enforcement). Extract here to avoid duplication.
/// </summary>
internal static class VoucherValidationHelper
{
    /// <summary>
    /// Validates a voucher for a given order context and returns the calculated discount amount.
    /// Throws domain exceptions with Vietnamese user-facing messages on any violation.
    /// </summary>
    /// <param name="voucher">Loaded voucher entity with Redemptions collection included.</param>
    /// <param name="subtotal">Sum of order line totals before shipping and discount.</param>
    /// <param name="customerId">ID of the customer applying the voucher.</param>
    /// <returns>Calculated discount amount (always >= 0, <= subtotal).</returns>
    internal static decimal Validate(Voucher voucher, decimal subtotal, int customerId)
    {
        var now = DateTime.UtcNow;

        if (!voucher.IsActive)
            throw new BadException("Mã voucher không còn hoạt động.");

        if (voucher.StartsAt.HasValue && now < voucher.StartsAt.Value)
            throw new BadException("Mã voucher chưa đến ngày sử dụng.");

        if (voucher.EndsAt.HasValue && now > voucher.EndsAt.Value)
            throw new BadException("Mã voucher đã hết hạn.");

        if (!voucher.CanBeUsedForChannel(SalesChannel.ONLINE))
            throw new BadException("Mã này chỉ áp dụng tại cửa hàng.");

        if (voucher.MinOrderTotal.HasValue && subtotal < voucher.MinOrderTotal.Value)
            throw new BadException(
                $"Đơn hàng tối thiểu {voucher.MinOrderTotal.Value:N0} ₫ để dùng mã này."
            );

        if (voucher.UsageLimit.HasValue && voucher.Redemptions.Count >= voucher.UsageLimit.Value)
            throw new BadException("Mã voucher đã hết lượt sử dụng.");

        if (voucher.UsagePerCustomer.HasValue)
        {
            var customerUsages = voucher.Redemptions.Count(r => r.CustomerId == customerId);
            if (customerUsages >= voucher.UsagePerCustomer.Value)
                throw new BadException("Bạn đã sử dụng hết lượt dùng của mã này.");
        }

        return voucher.CalculateDiscount(subtotal);
    }
}
