public record UpdateCartItemResult
{
    public required int CartItemId { get; init; }
    public required int SellableItemId { get; init; }
    public required int InventoryId { get; init; }
    public required int OldQuantity { get; init; }
    public required int NewQuantity { get; init; }
    public required int TotalCartItems { get; init; }
    public required int TotalAvailableInventory { get; init; }
    public required string Message { get; init; }
}
