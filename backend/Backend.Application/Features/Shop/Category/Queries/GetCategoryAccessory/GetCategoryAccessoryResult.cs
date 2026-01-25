public record GetCategoryAccessoryResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required List<BrandSummaryDto> Brands { get; init; }
    public int BrandCount { get; init; }
    public int AccessoryCount { get; init; }
    public required DateTime CreatedAt { get; init; }
}
