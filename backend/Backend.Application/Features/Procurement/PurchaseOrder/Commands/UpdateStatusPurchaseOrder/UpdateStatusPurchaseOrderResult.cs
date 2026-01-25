public record UpdateStatusPurchaseOrderResult
{
    public required int Id { get; init; }
    public required string VendorName { get; init; }
    public required string StoreName { get; init; }
    public required PurchaseStatus OldStatus { get; init; }
    public required PurchaseStatus NewStatus { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
