public class BrandCategoryAccessory : BaseEntity
{
    public BrandCategoryAccessory() { }

    public int CategoryId { get; set; }
    public required string Name { get; set; } // Gucci, Dior, ...
    public string Slug { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string? PublicId { get; set; } // Cloudinary public ID for image deletion
    public bool IsDeleted { get; set; } = false;

    // Navigation properties
    public CategoryAccessory Category { get; set; } = null!;
    public ICollection<Accessory> Accessories { get; set; } = new List<Accessory>();

    // Business logic
    public void UpdateInfo(string name, string slug, string thumbnailUrl, string? publicId = null)
    {
        Name = name;
        Slug = slug;
        ThumbnailUrl = thumbnailUrl;
        if (publicId != null)
            PublicId = publicId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SoftDelete()
    {
        IsDeleted = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Restore()
    {
        IsDeleted = false;
        UpdatedAt = DateTime.UtcNow;
    }
}
