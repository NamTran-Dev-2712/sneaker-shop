public record GetFeaturedAccessoryResult
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
    public required FeaturedAccessoryCategoryDto Category { get; init; }
    public required FeaturedAccessoryBrandDto Brand { get; init; }
}

public record FeaturedAccessoryCategoryDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
}

public record FeaturedAccessoryBrandDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
}
