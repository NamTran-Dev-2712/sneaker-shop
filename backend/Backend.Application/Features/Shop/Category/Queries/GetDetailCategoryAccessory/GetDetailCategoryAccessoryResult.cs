public record GetDetailCategoryAccessoryResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
    public required List<BrandDetailDto> Brands { get; init; }
    public int AccessoryCount { get; init; }
}

public record BrandDetailDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string ThumbnailUrl { get; init; }
    public required DateTime CreatedAt { get; init; }
    public int AccessoryCount { get; init; }
}
