public class SneakerColorway : BaseEntity
{
    public SneakerColorway() { }

    public int SneakerId { get; set; }
    public int ColorId { get; set; }
    public string CoverImage { get; set; } = string.Empty; // Ảnh của màu đó
    public string PublicId { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public Sneaker Sneaker { get; set; } = null!;
    public Color Color { get; set; } = null!;
    public ICollection<SneakerVariant> Variants { get; set; } = new List<SneakerVariant>();

    // Business logic
    public void UpdateCoverImage(string coverImage, string publicId)
    {
        CoverImage = coverImage;
        PublicId = publicId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }
}
