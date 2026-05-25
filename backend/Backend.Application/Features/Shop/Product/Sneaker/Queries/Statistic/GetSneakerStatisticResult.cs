public record GetSneakerStatisticResult
{
    public required int TotalSneakers { get; init; }
    public required int ActiveSneakers { get; init; }
    public required int InactiveSneakers { get; init; }
    public required int DeletedSneakers { get; init; }
    public required int TotalSellableItems { get; init; }
}
