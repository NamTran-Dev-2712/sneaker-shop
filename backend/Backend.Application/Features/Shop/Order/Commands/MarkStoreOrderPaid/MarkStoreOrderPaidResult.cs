public record MarkStoreOrderPaidResult
{
    public required int OrderId { get; init; }
    public required string Status { get; init; }
    public required string PaymentStatus { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
