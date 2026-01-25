public record GetVendorStatisticResult
{
    public required int TotalVendors { get; init; }
    public required int ActiveVendors { get; init; }
    public required int InactiveVendors { get; init; }
    public required int TotalProductsSupplied { get; init; }
    public required int PendingPurchaseOrders { get; init; }
}
