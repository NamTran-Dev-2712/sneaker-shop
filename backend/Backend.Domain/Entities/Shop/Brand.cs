public class Brand : BaseEntity
{
    public Brand() { }

    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public required string LogoUrl { get; set; }
    public string? PublicIdLogo { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; } = false;

    // Navigation properties
    public ICollection<BrandSeries> BrandSeries { get; set; } = new List<BrandSeries>();
    public ICollection<Sneaker> Sneakers { get; set; } = new List<Sneaker>();

    // Business logic
    public void UpdateInfo(string name, string slug, string logoUrl, string? publicIdLogo = null)
    {
        Name = name;
        Slug = slug;
        LogoUrl = logoUrl;
        PublicIdLogo = publicIdLogo;
        UpdatedAt = DateTime.UtcNow;
    }
}
