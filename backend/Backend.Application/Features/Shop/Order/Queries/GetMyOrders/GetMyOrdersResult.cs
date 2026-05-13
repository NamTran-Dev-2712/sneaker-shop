public record GetMyOrdersResult
{
    public required int OrderId { get; init; }
    public DateTime? PlacedAt { get; init; }
    public required string Status { get; init; }
    public required string PaymentMethod { get; init; }
    public required string FulfillmentType { get; init; }
    public decimal Subtotal { get; init; }
    public decimal ShippingFee { get; init; }
    public decimal DiscountTotal { get; init; }
    public decimal Total { get; init; }
    public int ItemCount { get; init; }
    public string? FirstItemName { get; init; }
    public string? FirstItemImage { get; init; }
}
