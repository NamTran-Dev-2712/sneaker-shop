public record GetDetailInventoryResult
{
    public required int Id { get; init; }
    public required int StoreId { get; init; }
    public required string StoreName { get; init; }
    public string? StoreAddress { get; init; }
    public required int SellableItemId { get; init; }
    public required string ProductName { get; init; }
    public required SellableType SellableType { get; init; }
    public required string SKU { get; init; }
    public string? Barcode { get; init; }
    public string? ColorName { get; init; }
    public string? SizeName { get; init; }
    public required int OnHand { get; init; }
    public required int Reserved { get; init; }
    public required int Available { get; init; }
    public required decimal ProductPrice { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
