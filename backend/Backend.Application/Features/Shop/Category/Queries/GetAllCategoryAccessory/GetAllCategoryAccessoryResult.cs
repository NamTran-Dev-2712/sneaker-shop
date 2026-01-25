public record GetAllCategoryAccessoryResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required List<BrandSummaryDto> Brands { get; init; }
}

public record BrandSummaryDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string ThumbnailUrl { get; init; }
}
