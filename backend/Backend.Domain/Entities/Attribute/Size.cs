public class Size : BaseEntity
{
    public Size() { }

    public string System { get; set; } = string.Empty; // US, UK, EU, etc.
    public decimal Value { get; set; }

    // Navigation properties
    public ICollection<SneakerVariant> SneakerVariants { get; set; } = new List<SneakerVariant>();

    // Business logic
    public void UpdateInfo(string system, decimal value)
    {
        System = system;
        Value = value;
        UpdatedAt = DateTime.UtcNow;
    }
}
