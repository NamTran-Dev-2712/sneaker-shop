public record CreateOrderResult
{
    public required int OrderId { get; init; }
    public required string Status { get; init; }
    public required decimal Subtotal { get; init; }
    public required decimal ShippingFee { get; init; }
    public required decimal Total { get; init; }
    public required string PaymentMethod { get; init; }
    public required string FulfillmentType { get; init; }
    public required DateTime PlacedAt { get; init; }
    public required string Message { get; init; }
}
