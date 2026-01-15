public record GetSneakerDetailResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public string? Description { get; init; }
    public required string MainImage { get; init; }
    public required List<SneakerDetailSubImageDto> SubImages { get; init; }
    public decimal? BasePrice { get; init; }
    public required bool IsActive { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
    public required SneakerDetailBrandDto Brand { get; init; }
    public SneakerDetailBrandSeriesDto? BrandSeries { get; init; }
    public required List<SneakerDetailColorwayDto> Colorways { get; init; }
}

public record SneakerDetailSubImageDto
{
    public required int Id { get; init; }
    public required string ImageUrl { get; init; }
}

public record SneakerDetailBrandDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public string? LogoUrl { get; init; }
}

public record SneakerDetailBrandSeriesDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
}

public record SneakerDetailColorwayDto
{
    public required int Id { get; init; }
    public required SneakerDetailColorDto Color { get; init; }
    public required string CoverImage { get; init; }
    public required bool IsActive { get; init; }
    public required List<SneakerDetailVariantDto> Variants { get; init; }
}

public record SneakerDetailColorDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string Hex { get; init; }
}

public record SneakerDetailVariantDto
{
    public required int Id { get; init; }
    public required SneakerDetailSizeDto Size { get; init; }
    public required string Sku { get; init; }
    public decimal? RetailPrice { get; init; }
    public decimal? OnlinePrice { get; init; }
    public required bool IsActive { get; init; }
}

public record SneakerDetailSizeDto
{
    public required int Id { get; init; }
    public required string System { get; init; }
    public required decimal Value { get; init; }
}
