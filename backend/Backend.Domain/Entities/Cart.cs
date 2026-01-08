public class Cart : BaseEntity
{
    public Cart() { }

    public int CustomerId { get; set; }

    // Navigation properties
    public Customer Customer { get; set; } = null!;
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();

    // Business logic
    public int GetTotalItems()
    {
        return Items.Sum(item => item.Quantity);
    }

    public void Clear()
    {
        Items.Clear();
        UpdatedAt = DateTime.UtcNow;
    }
}
