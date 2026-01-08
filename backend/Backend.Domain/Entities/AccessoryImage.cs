public class AccessoryImage : BaseEntity
{
    public AccessoryImage() { }

    public int AccessoryId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;

    // Navigation properties
    public Accessory Accessory { get; set; } = null!;

    // Business logic
    public void UpdateImageUrl(string imageUrl)
    {
        ImageUrl = imageUrl;
        UpdatedAt = DateTime.UtcNow;
    }
}
