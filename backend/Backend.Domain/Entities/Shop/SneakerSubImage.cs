public class SneakerSubImage : BaseEntity
{
    public SneakerSubImage() { }

    public int SneakerId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;

    // Navigation properties
    public Sneaker Sneaker { get; set; } = null!;

    // Business logic
    public void UpdateImage(string imageUrl, string publicId)
    {
        ImageUrl = imageUrl;
        PublicId = publicId;
        UpdatedAt = DateTime.UtcNow;
    }
}
