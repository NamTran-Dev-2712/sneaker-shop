public class Voucher : BaseEntity
{
    public Voucher() { }

    public string Code { get; set; } = string.Empty;
    public DiscountType DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal? MaxDiscount { get; set; }
    public decimal? MinOrderTotal { get; set; }
    public VoucherScope Scope { get; set; } = VoucherScope.ALL;
    public int? UsageLimit { get; set; }
    public int? UsagePerCustomer { get; set; }
    public DateTime? StartsAt { get; set; }
    public DateTime? EndsAt { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<VoucherRedemption> Redemptions { get; set; } = new List<VoucherRedemption>();

    // Business logic
    public bool IsValidAt(DateTime date)
    {
        if (!IsActive)
            return false;
        if (StartsAt.HasValue && date < StartsAt.Value)
            return false;
        if (EndsAt.HasValue && date > EndsAt.Value)
            return false;
        return true;
    }

    public bool CanBeUsedForChannel(SalesChannel channel)
    {
        if (Scope == VoucherScope.ALL)
            return true;
        if (Scope == VoucherScope.ONLINE && channel == SalesChannel.ONLINE)
            return true;
        if (Scope == VoucherScope.POS && channel == SalesChannel.POS)
            return true;
        return false;
    }

    public bool CanBeAppliedToOrder(decimal orderTotal, SalesChannel channel, DateTime date)
    {
        if (!IsValidAt(date))
            return false;
        if (!CanBeUsedForChannel(channel))
            return false;
        if (MinOrderTotal.HasValue && orderTotal < MinOrderTotal.Value)
            return false;
        return true;
    }

    public decimal CalculateDiscount(decimal orderTotal)
    {
        decimal discount =
            DiscountType == DiscountType.PERCENT
                ? orderTotal * (DiscountValue / 100)
                : DiscountValue;

        if (MaxDiscount.HasValue && discount > MaxDiscount.Value)
            discount = MaxDiscount.Value;

        if (discount > orderTotal)
            discount = orderTotal;

        return discount;
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateInfo(
        DiscountType discountType,
        decimal discountValue,
        decimal? maxDiscount,
        decimal? minOrderTotal
    )
    {
        DiscountType = discountType;
        DiscountValue = discountValue;
        MaxDiscount = maxDiscount;
        MinOrderTotal = minOrderTotal;
        UpdatedAt = DateTime.UtcNow;
    }
}
