public class Payment : BaseEntity
{
    public Payment() { }

    public int OrderId { get; set; }
    public PaymentMethod Method { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.PENDING;
    public decimal Amount { get; set; }
    public string? Provider { get; set; } // Cổng/nhà cung cấp thanh toán online
    public string? ProviderTxnId { get; set; } // Mã giao dịch cổng thanh toán để đối chiếu
    public DateTime? PaidAt { get; set; }

    // Navigation properties
    public Order Order { get; set; } = null!;

    // Business logic
    public void MarkAsPaid()
    {
        Status = PaymentStatus.PAID;
        PaidAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsFailed()
    {
        Status = PaymentStatus.FAILED;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Refund()
    {
        Status = PaymentStatus.REFUNDED;
        UpdatedAt = DateTime.UtcNow;
    }

    public void PartialRefund()
    {
        Status = PaymentStatus.PARTIALLY_REFUNDED;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateProviderInfo(string provider, string providerTxnId)
    {
        Provider = provider;
        ProviderTxnId = providerTxnId;
        UpdatedAt = DateTime.UtcNow;
    }
}
