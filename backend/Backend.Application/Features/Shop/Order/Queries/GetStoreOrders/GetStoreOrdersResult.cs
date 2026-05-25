public record GetStoreOrdersResult
{
    public required int OrderId { get; init; }
    public required string OrderCode { get; init; }
    public DateTime? PlacedAt { get; init; }
    public required string Status { get; init; }
    public required string PaymentStatus { get; init; }
    public required string PaymentMethod { get; init; }
    public required string FulfillmentType { get; init; }
    public string? CustomerName { get; init; }
    public string? CustomerPhone { get; init; }
    public decimal Total { get; init; }
    public int ItemCount { get; init; }
    public string? FirstItemName { get; init; }
    public string? FirstItemImage { get; init; }
}
