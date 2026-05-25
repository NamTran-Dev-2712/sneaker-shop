public record RemoveItemCartResult
{
    public required int RemovedCartItemId { get; init; }
    public required int SellableItemId { get; init; }
    public required int RemovedQuantity { get; init; }
    public required int RemainingCartItems { get; init; }
    public required int TotalCartItems { get; init; }
    public required string Message { get; init; }
}
