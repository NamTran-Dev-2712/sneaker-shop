public record PackStoreOrderResult
{
    public required int OrderId { get; init; }
    public required string Status { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
