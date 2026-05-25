public record GetBrandStatisticResult
{
    public required int TotalBrands { get; init; }
    public required int ActiveBrands { get; init; }
    public required int InactiveBrands { get; init; }
    public required int TotalBrandSeries { get; init; }
}
