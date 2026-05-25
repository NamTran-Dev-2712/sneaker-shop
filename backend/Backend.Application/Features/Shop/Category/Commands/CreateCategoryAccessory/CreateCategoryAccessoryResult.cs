public record CreateCategoryAccessoryResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required List<BrandResultDto> Brands { get; init; }
}

public record BrandResultDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string ThumbnailUrl { get; init; }
}
