public record GetBrandDetailResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string LogoUrl { get; init; }
    public required bool IsActive { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
    public required List<BrandSeriesDto> Series { get; init; }
}

public record BrandSeriesDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required bool IsActive { get; init; }
    public required int SneakerCount { get; init; }
}
