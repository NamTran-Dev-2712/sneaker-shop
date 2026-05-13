public record GetFinanceLedgerItemResult
{
    public required int Id { get; init; }
    public required FinanceEntryStatus Status { get; init; }
    public required decimal Amount { get; init; }
    public required string Category { get; init; }
    public string? Description { get; init; }
    public required FinanceEntrySourceType SourceType { get; init; }
    public int? SourceId { get; init; }
    public int? StoreId { get; init; }
    public string? StoreName { get; init; }
    public required DateTime OccurredAt { get; init; }
    public required DateTime CreatedAt { get; init; }
}
