public record GetMyLoyaltyTransactionsResult
{
    public required int Id { get; init; }
    public required string TxnType { get; init; }
    public required long Points { get; init; }
    public string? Reason { get; init; }
    public int? OrderId { get; init; }
    public required DateTime CreatedAt { get; init; }
}
