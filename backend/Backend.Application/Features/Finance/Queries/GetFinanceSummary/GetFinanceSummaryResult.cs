public record GetFinanceSummaryResult
{
    public required decimal TotalIncome { get; init; }
    public required decimal TotalExpense { get; init; }
    public required decimal Profit { get; init; }
    public required int TotalTransactions { get; init; }
    public required DateTime RangeStart { get; init; }
    public required DateTime RangeEnd { get; init; }
}
