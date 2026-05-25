public class Sneaker : BaseEntity
{
    public Sneaker() { }

    public int BrandId { get; set; }
    public required int BrandSeriesId { get; set; }
    public required string Name { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string MainImage { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;
    public decimal? BasePrice { get; set; } // Giá tham khảo (giá thấp nhất)
    public int Selled { get; set; } = 0;
    public int ViewCount { get; set; } = 0;
    public int RatingCount { get; set; } = 0;
    public decimal AverageRating { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; } = false;

    // Navigation properties
    public Brand Brand { get; set; } = null!;
    public BrandSeries? BrandSeries { get; set; }
    public ICollection<SneakerColorway> Colorways { get; set; } = new List<SneakerColorway>();
    public ICollection<SneakerVariant> Variants { get; set; } = new List<SneakerVariant>();
    public ICollection<SneakerSubImage> SneakerSubImages { get; set; } =
        new List<SneakerSubImage>();

    // Business logic
    public void UpdateInfo(
        string name,
        string slug,
        string? description,
        string mainImage,
        string publicId,
        decimal? basePrice
    )
    {
        Name = name;
        Slug = slug;
        Description = description;
        MainImage = mainImage;
        PublicId = publicId;
        BasePrice = basePrice;
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

    public void SoftDelete()
    {
        IsDeleted = true;
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Restore()
    {
        IsDeleted = false;
        UpdatedAt = DateTime.UtcNow;
    }
}
