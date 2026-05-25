public class AccessoryImage : BaseEntity
{
    public AccessoryImage() { }

    public int AccessoryId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? PublicId { get; set; } // Cloudinary public ID for image deletion

    // Navigation properties
    public Accessory Accessory { get; set; } = null!;

    // Business logic
    public void UpdateImageUrl(string imageUrl, string? publicId = null)
    {
        ImageUrl = imageUrl;
        if (publicId != null)
            PublicId = publicId;
        UpdatedAt = DateTime.UtcNow;
    }
}
