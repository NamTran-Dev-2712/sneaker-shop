public class Cart : BaseEntity
{
    public Cart() { }

    public int CustomerId { get; set; }
    public int TotalCount { get; set; } = 0;

    // Navigation properties
    public Customer Customer { get; set; } = null!;
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();

    // Factory method
    public static Cart Create(int customerId)
    {
        return new Cart
        {
            CustomerId = customerId,
            TotalCount = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
    }

    // Business logic

    /// <summary>
    /// Calculate total quantity of all items in cart
    /// </summary>
    public int GetTotalQuantity()
    {
        return Items.Sum(item => item.Quantity);
    }

    /// <summary>
    /// Get total number of distinct items in cart
    /// </summary>
    public int GetTotalItems()
    {
        return Items.Count;
    }

    /// <summary>
    /// Recalculate and update TotalCount based on current items
    /// </summary>
    public void RecalculateTotalCount()
    {
        TotalCount = GetTotalQuantity();
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Clear all items from cart
    /// </summary>
    public void Clear()
    {
        Items.Clear();
        TotalCount = 0;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Check if cart contains a specific sellable item
    /// </summary>
    public bool ContainsItem(int sellableItemId)
    {
        return Items.Any(item => item.SellableItemId == sellableItemId);
    }

    /// <summary>
    /// Get item by sellable item ID (unique constraint: cart_id, sellable_item_id)
    /// </summary>
    public CartItem? GetItem(int sellableItemId)
    {
        return Items.FirstOrDefault(item => item.SellableItemId == sellableItemId);
    }

    /// <summary>
    /// Check if cart is empty
    /// </summary>
    public bool IsEmpty()
    {
        return Items.Count == 0;
    }
}
