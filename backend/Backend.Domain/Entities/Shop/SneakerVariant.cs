public class SneakerVariant : BaseEntity
{
    public SneakerVariant() { }

    public int SneakerId { get; set; }
    public int ColorwayId { get; set; }
    public int SizeId { get; set; }

    // Navigation properties
    public Sneaker Sneaker { get; set; } = null!;
    public SneakerColorway Colorway { get; set; } = null!;
    public Size Size { get; set; } = null!;
    public SellableItem? SellableItem { get; set; }

    // Business logic: Unique constraint (sneaker_id, colorway_id, size_id)
}
