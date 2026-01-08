public class CartItem : BaseEntity
{
    public CartItem() { }

    public int CartId { get; set; }
    public int SellableItemId { get; set; }
    public int Quantity { get; set; }

    // Navigation properties
    public Cart Cart { get; set; } = null!;
    public SellableItem SellableItem { get; set; } = null!;

    // Business logic: unique (cart_id, sellable_item_id)

    public void UpdateQuantity(int newQuantity)
    {
        if (newQuantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(newQuantity));

        Quantity = newQuantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void IncreaseQuantity(int amount = 1)
    {
        if (amount <= 0)
            throw new ArgumentException("Amount must be positive", nameof(amount));

        Quantity += amount;
        UpdatedAt = DateTime.UtcNow;
    }

    public void DecreaseQuantity(int amount = 1)
    {
        if (amount <= 0)
            throw new ArgumentException("Amount must be positive", nameof(amount));

        Quantity -= amount;
        if (Quantity < 0)
            Quantity = 0;
        UpdatedAt = DateTime.UtcNow;
    }
}
