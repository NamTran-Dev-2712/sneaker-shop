public record ClearCartResult
{
    public required int CartId { get; init; }
    public required int RemovedItemsCount { get; init; }
    public required int RemovedTotalQuantity { get; init; }
    public required string Message { get; init; }
}
