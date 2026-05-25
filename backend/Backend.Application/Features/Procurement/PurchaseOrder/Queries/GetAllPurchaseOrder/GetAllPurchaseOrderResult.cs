public record GetAllPurchaseOrderResult
{
    public required int Id { get; init; }
    public required string VendorName { get; init; }
    public required string StoreName { get; init; }
    public required PurchaseStatus Status { get; init; }
    public required decimal TotalCost { get; init; }
    public required int ItemCount { get; init; }
    public required DateTime CreatedAt { get; init; }
}
