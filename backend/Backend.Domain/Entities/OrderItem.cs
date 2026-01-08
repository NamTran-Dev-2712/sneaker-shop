public class OrderItem : BaseEntity
{
    public OrderItem() { }

    public int OrderId { get; set; }
    public int SellableItemId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Discount { get; set; } = 0;
    public decimal LineTotal { get; set; }

    // Navigation properties
    public Order Order { get; set; } = null!;
    public SellableItem SellableItem { get; set; } = null!;

    // Business logic: unique (order_id, sellable_item_id)

    public void CalculateLineTotal()
    {
        LineTotal = (UnitPrice * Quantity) - Discount;
        if (LineTotal < 0)
            LineTotal = 0;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateQuantity(int newQuantity)
    {
        if (newQuantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(newQuantity));

        Quantity = newQuantity;
        CalculateLineTotal();
    }

    public void ApplyDiscount(decimal discountAmount)
    {
        Discount = discountAmount;
        CalculateLineTotal();
    }
}
