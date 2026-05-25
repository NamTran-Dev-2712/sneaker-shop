public record GetPurchaseOrderStatisticResult
{
    public required int TotalOrders { get; init; }
    public required int TotalCreated { get; init; }
    public required int TotalOrdered { get; init; }
    public required int TotalReceived { get; init; }
    public required int TotalCancelled { get; init; }
    public required decimal TotalCost { get; init; }
    public required decimal TotalReceivedCost { get; init; }
}
