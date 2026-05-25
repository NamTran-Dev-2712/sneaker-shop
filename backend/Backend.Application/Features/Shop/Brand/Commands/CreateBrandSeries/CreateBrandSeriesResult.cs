public record CreateBrandSeriesResult
{
    public required int Id { get; init; }
    public required int BrandId { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required bool IsActive { get; init; }
    public required DateTime CreatedAt { get; init; }
}
