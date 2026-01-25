public record GetDetailPurchaseOrderResult
{
    public required int Id { get; init; }
    public required int VendorId { get; init; }
    public required string VendorName { get; init; }
    public string? VendorPhone { get; init; }
    public string? VendorEmail { get; init; }
    public required int StoreId { get; init; }
    public required string StoreName { get; init; }
    public required PurchaseStatus Status { get; init; }
    public DateTime? ExpectedAt { get; init; }
    public string? Note { get; init; }
    public required decimal TotalCost { get; init; }
    public required int ItemCount { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
    public required List<PurchaseOrderItemResult> Items { get; init; }
}

public record PurchaseOrderItemResult
{
    public required int Id { get; init; }
    public required int SellableItemId { get; init; }
    public required string SellableItemName { get; init; }
    public required SellableType SellableType { get; init; }
    public string? ColorName { get; init; }
    public string? SizeName { get; init; }
    public required string SKU { get; init; }
    public required int Quantity { get; init; }
    public required decimal UnitCost { get; init; }
    public required decimal TotalCost { get; init; }
}
