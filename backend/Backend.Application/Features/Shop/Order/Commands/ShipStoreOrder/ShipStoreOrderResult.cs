public record ShipStoreOrderResult
{
    public required int OrderId { get; init; }
    public required string Status { get; init; }
    public string? Carrier { get; init; }
    public string? TrackingCode { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
