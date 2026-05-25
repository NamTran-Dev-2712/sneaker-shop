public record CancelStoreOrderResult
{
    public required int OrderId { get; init; }
    public required string Status { get; init; }
    public string? Reason { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
