public class Color : BaseEntity
{
    public Color() { }

    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public required string Hex { get; set; }

    // Navigation properties
    public ICollection<SneakerColorway> SneakerColorways { get; set; } =
        new List<SneakerColorway>();

    // Business logic
    public void UpdateInfo(string name, string slug, string hex)
    {
        Name = name;
        Slug = slug;
        Hex = hex;
        UpdatedAt = DateTime.UtcNow;
    }
}
