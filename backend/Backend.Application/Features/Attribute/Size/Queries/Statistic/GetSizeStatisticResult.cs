public record GetSizeStatisticResult
{
    public required int TotalSizes { get; init; }
    public required int SizesInUse { get; init; }
    public required int TotalProductsUsingSizes { get; init; }
}
