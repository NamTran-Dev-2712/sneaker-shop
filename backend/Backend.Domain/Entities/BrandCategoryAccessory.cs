public class BrandCategoryAccessory : BaseEntity
{
    public BrandCategoryAccessory() { }

    public int CategoryId { get; set; }
    public required string Name { get; set; } // Gucci, Dior, ...
    public string Slug { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;

    // Navigation properties
    public CategoryAccessory Category { get; set; } = null!;
    public ICollection<Accessory> Accessories { get; set; } = new List<Accessory>();

    // Business logic
    public void UpdateInfo(string name, string slug, string thumbnailUrl)
    {
        Name = name;
        Slug = slug;
        ThumbnailUrl = thumbnailUrl;
        UpdatedAt = DateTime.UtcNow;
    }
}
