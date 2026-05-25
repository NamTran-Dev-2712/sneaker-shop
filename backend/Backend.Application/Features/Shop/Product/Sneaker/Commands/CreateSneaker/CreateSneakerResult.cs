public record CreateSneakerResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string MainImage { get; init; }
    public required List<SubImageDto> SubImages { get; init; }
    public string? Description { get; init; }
    public required BrandDto Brand { get; init; }
    public BrandSeriesDto? BrandSeries { get; init; }
    public required List<ColorwayDto> Colorways { get; init; }
    public required DateTime CreatedAt { get; init; }
}

public record SubImageDto
{
    public required int Id { get; init; }
    public required string ImageUrl { get; init; }
}

public record BrandDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
}

public record ColorwayDto
{
    public required int Id { get; init; }
    public required ColorDto Color { get; init; }
    public required string CoverImage { get; init; }
    public required List<VariantDto> Variants { get; init; }
}

public record ColorDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Hex { get; init; }
}

public record VariantDto
{
    public required int Id { get; init; }
    public required SizeDto Size { get; init; }
    public required string Sku { get; init; }
    public decimal? RetailPrice { get; init; }
    public decimal? OnlinePrice { get; init; }
}

public record SizeDto
{
    public required int Id { get; init; }
    public required string System { get; init; }
    public required decimal Value { get; init; }
}
