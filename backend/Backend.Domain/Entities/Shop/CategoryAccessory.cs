public class CategoryAccessory : BaseEntity
{
    public CategoryAccessory() { }

    public string Name { get; set; } = string.Empty; // Phụ kiện, mắt kính, ...
    public string Slug { get; set; } = string.Empty;
    public bool IsDeleted { get; set; } = false;

    // Navigation properties
    public ICollection<BrandCategoryAccessory> Brands { get; set; } =
        new List<BrandCategoryAccessory>();
    public ICollection<Accessory> Accessories { get; set; } = new List<Accessory>();

    // Business logic
    public void UpdateInfo(string name, string slug)
    {
        Name = name;
        Slug = slug;
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
