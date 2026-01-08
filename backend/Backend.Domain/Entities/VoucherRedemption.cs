public class VoucherRedemption : BaseEntity
{
    public VoucherRedemption() { }

    public int VoucherId { get; set; }
    public int OrderId { get; set; }
    public int? CustomerId { get; set; }
    public DateTime? RedeemedAt { get; set; }

    // Navigation properties
    public Voucher Voucher { get; set; } = null!;
    public Order Order { get; set; } = null!;
    public Customer? Customer { get; set; }

    // Business logic: unique order_id (one voucher per order)

    public void Redeem()
    {
        RedeemedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}
