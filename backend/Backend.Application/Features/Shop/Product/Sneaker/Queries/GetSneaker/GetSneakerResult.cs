public record GetSneakerResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string MainImage { get; init; }
    public decimal? BasePrice { get; init; }
    public required bool IsActive { get; init; }
    public required SneakerListBrandDto Brand { get; init; }
    public SneakerListBrandSeriesDto? BrandSeries { get; init; }
    public required int ColorCount { get; init; }
    public required int VariantCount { get; init; }
    public required DateTime CreatedAt { get; init; }
}

public record SneakerListBrandDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
}

public record SneakerListBrandSeriesDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
}
