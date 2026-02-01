public record GetFeaturedSneakerResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string MainImage { get; init; }
    public decimal? BasePrice { get; init; }
    public required int Selled { get; init; }
    public required int ViewCount { get; init; }
    public required int RatingCount { get; init; }
    public required decimal AverageRating { get; init; }
    public required FeaturedSneakerBrandDto Brand { get; init; }
    public FeaturedSneakerBrandSeriesDto? BrandSeries { get; init; }
}

public record FeaturedSneakerBrandDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
}

public record FeaturedSneakerBrandSeriesDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
}
