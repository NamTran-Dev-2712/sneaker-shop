public record UpdateCategoryAccessoryResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required DateTime UpdatedAt { get; init; }
    public required List<BrandResultDto> Brands { get; init; }
    public int BrandsAdded { get; init; }
    public int BrandsUpdated { get; init; }
    public int BrandsRemoved { get; init; }
}
