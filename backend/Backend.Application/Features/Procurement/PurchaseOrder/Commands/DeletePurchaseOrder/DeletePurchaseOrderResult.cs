public record DeletePurchaseOrderResult
{
    public required int Id { get; init; }
    public required string VendorName { get; init; }
    public required string StoreName { get; init; }
    public required PurchaseStatus Status { get; init; }
    public required string Message { get; init; }
}
