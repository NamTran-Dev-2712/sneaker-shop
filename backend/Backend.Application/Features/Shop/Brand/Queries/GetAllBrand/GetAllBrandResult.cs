public record GetAllBrandResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string LogoUrl { get; init; }
    public required bool IsActive { get; init; }
    public required int SeriesCount { get; init; }
    public required List<GetAllBrandSeriesDto> Series { get; init; }
    public required DateTime CreatedAt { get; init; }
}

public record GetAllBrandSeriesDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required bool IsActive { get; init; }
    public required int SneakerCount { get; init; }
}
