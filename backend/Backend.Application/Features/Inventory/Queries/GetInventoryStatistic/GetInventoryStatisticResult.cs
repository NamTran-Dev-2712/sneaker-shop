public record GetInventoryStatisticResult
{
    public required int TotalItems { get; init; }
    public required int TotalOnHand { get; init; }
    public required int TotalReserved { get; init; }
    public required int TotalAvailable { get; init; }
    public required int LowStockCount { get; init; }
    public required int OutOfStockCount { get; init; }
    public required int SneakerCount { get; init; }
    public required int AccessoryCount { get; init; }
    public required int StoresWithInventory { get; init; }
}
