public record AddToCartResult
{
    public required int CartId { get; init; }
    public required int CartItemId { get; init; }
    public required int SellableItemId { get; init; }
    public required int InventoryId { get; init; }
    public required int Quantity { get; init; }
    public required int TotalCartItems { get; init; }
    public required bool IsNewCart { get; init; }
    public required bool IsMerged { get; init; }
    public required string Message { get; init; }
}
