public record CreateManualFinanceEntryResult
{
    public required int Id { get; init; }
    public required FinanceEntryStatus Status { get; init; }
    public required decimal Amount { get; init; }
    public required string Category { get; init; }
    public string? Description { get; init; }
    public int? StoreId { get; init; }
    public required DateTime OccurredAt { get; init; }
    public required DateTime CreatedAt { get; init; }
}
