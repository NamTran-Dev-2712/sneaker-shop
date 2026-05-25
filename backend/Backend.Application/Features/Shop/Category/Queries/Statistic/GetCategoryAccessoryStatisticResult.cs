public record GetCategoryAccessoryStatisticResult
{
    public required int TotalCategories { get; init; }
    public required int ActiveCategories { get; init; }
    public required int DeletedCategories { get; init; }
    public required int TotalBrands { get; init; }
    public required int ActiveBrands { get; init; }
    public required int DeletedBrands { get; init; }
    public required int TotalAccessories { get; init; }
}
