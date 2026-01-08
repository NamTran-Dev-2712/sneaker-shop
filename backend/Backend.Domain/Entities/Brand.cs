public class Brand : BaseEntity
{
    public Brand() { }

    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public required string LogoUrl { get; set; }

    // Navigation properties
    public ICollection<BrandSeries> BrandSeries { get; set; } = new List<BrandSeries>();
    public ICollection<Sneaker> Sneakers { get; set; } = new List<Sneaker>();

    // Business logic
    public void UpdateInfo(string name, string slug, string logoUrl)
    {
        Name = name;
        Slug = slug;
        LogoUrl = logoUrl;
        UpdatedAt = DateTime.UtcNow;
    }
}
