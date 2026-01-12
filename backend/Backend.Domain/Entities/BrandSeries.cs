public class BrandSeries : BaseEntity
{
    public BrandSeries() { }

    public int BrandId { get; set; }
    public required string Name { get; set; }
    public string Slug { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; } = false;

    // Navigation properties
    public Brand Brand { get; set; } = null!;
    public ICollection<Sneaker> Sneakers { get; set; } = new List<Sneaker>();

    // Business logic
    public void UpdateInfo(string name, string slug)
    {
        Name = name;
        Slug = slug;
        UpdatedAt = DateTime.UtcNow;
    }
}
