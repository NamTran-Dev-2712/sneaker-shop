public class CartItem : BaseEntity
{
    public CartItem() { }

    public int CartId { get; set; }
    public int SellableItemId { get; set; }
    public int InventoryId { get; set; }
    public int Quantity { get; set; }

    // Navigation properties
    public Cart Cart { get; set; } = null!;
    public SellableItem SellableItem { get; set; } = null!;
    public Inventory Inventory { get; set; } = null!;

    // Business logic: unique (cart_id, sellable_item_id)

    // Factory method
    public static CartItem Create(int cartId, int sellableItemId, int inventoryId, int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(quantity));

        return new CartItem
        {
            CartId = cartId,
            SellableItemId = sellableItemId,
            InventoryId = inventoryId,
            Quantity = quantity,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
    }

    /// <summary>
    /// Update quantity to a new value
    /// </summary>
    public void UpdateQuantity(int newQuantity)
    {
        if (newQuantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(newQuantity));

        Quantity = newQuantity;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Increase quantity by a specified amount
    /// </summary>
    public void IncreaseQuantity(int amount = 1)
    {
        if (amount <= 0)
            throw new ArgumentException("Amount must be positive", nameof(amount));

        Quantity += amount;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Decrease quantity by a specified amount (minimum 0)
    /// </summary>
    public void DecreaseQuantity(int amount = 1)
    {
        if (amount <= 0)
            throw new ArgumentException("Amount must be positive", nameof(amount));

        Quantity -= amount;
        if (Quantity < 0)
            Quantity = 0;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Update the inventory source (when customer changes store selection)
    /// </summary>
    public void UpdateInventory(int newInventoryId)
    {
        InventoryId = newInventoryId;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Merge quantity from another item (when adding duplicate item to cart)
    /// </summary>
    public void MergeQuantity(int additionalQuantity)
    {
        if (additionalQuantity <= 0)
            throw new ArgumentException(
                "Additional quantity must be positive",
                nameof(additionalQuantity)
            );

        Quantity += additionalQuantity;
        UpdatedAt = DateTime.UtcNow;
    }
}
