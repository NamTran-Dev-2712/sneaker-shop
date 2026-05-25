public record GetStoreStatisticResult
{
    public required int TotalStores { get; init; }
    public required int ActiveStores { get; init; }
    public required int InactiveStores { get; init; }
    public required int TotalStaff { get; init; }
}
