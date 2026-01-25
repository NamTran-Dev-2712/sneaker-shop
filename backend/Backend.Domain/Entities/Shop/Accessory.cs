public class Accessory : BaseEntity
{
    public Accessory() { }

    public int CategoryId { get; set; }
    public int BrandId { get; set; }
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public string? Description { get; set; }
    public string MainImage { get; set; } = string.Empty;
    public string? PublicId { get; set; } // Cloudinary public ID for main image deletion
    public decimal? BasePrice { get; set; }
    public bool IsDeleted { get; set; } = false;

    // Navigation properties
    public CategoryAccessory Category { get; set; } = null!;
    public BrandCategoryAccessory Brand { get; set; } = null!;
    public ICollection<AccessoryImage> Images { get; set; } = new List<AccessoryImage>();
    public SellableItem? SellableItem { get; set; }

    // Business logic
    public void UpdateInfo(
        string name,
        string slug,
        string? description,
        string mainImage,
        decimal? basePrice
    )
    {
        Name = name;
        Slug = slug;
        Description = description;
        MainImage = mainImage;
        BasePrice = basePrice;
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
