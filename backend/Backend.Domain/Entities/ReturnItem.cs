public class ReturnItem : BaseEntity
{
    public ReturnItem() { }

    public int ReturnId { get; set; }
    public int SellableItemId { get; set; }
    public int Quantity { get; set; }
    public string? Condition { get; set; } // NEW/USED/DAMAGED
    public decimal RefundAmount { get; set; } = 0;

    // Navigation properties
    public Return Return { get; set; } = null!;
    public SellableItem SellableItem { get; set; } = null!;

    // Business logic
    public void UpdateCondition(string condition)
    {
        Condition = condition;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetRefundAmount(decimal amount)
    {
        if (amount < 0)
            throw new ArgumentException("Refund amount cannot be negative", nameof(amount));

        RefundAmount = amount;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateQuantity(int newQuantity)
    {
        if (newQuantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(newQuantity));

        Quantity = newQuantity;
        UpdatedAt = DateTime.UtcNow;
    }
}
