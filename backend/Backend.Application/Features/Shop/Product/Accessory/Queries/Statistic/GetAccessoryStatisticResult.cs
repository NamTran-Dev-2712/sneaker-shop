public record GetAccessoryStatisticResult
{
    public required int TotalAccessories { get; init; }
    public required int ActiveAccessories { get; init; }
    public required int InactiveAccessories { get; init; }
    public required int DeletedAccessories { get; init; }
    public required int TotalSellableItems { get; init; }
    public required int TotalImages { get; init; }
}
