public record CreatePurchaseOrderResult
{
    public required int Id { get; init; }
    public required int VendorId { get; init; }
    public required string VendorName { get; init; }
    public required int StoreId { get; init; }
    public required string StoreName { get; init; }
    public required PurchaseStatus Status { get; init; }
    public DateTime? ExpectedAt { get; init; }
    public string? Note { get; init; }
    public required decimal TotalCost { get; init; }
    public required int ItemCount { get; init; }
    public required DateTime CreatedAt { get; init; }
}
