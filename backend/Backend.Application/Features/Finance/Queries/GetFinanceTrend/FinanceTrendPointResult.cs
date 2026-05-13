public record FinanceTrendPointResult
{
    public required DateTime Date { get; init; }
    public required decimal Income { get; init; }
    public required decimal Expense { get; init; }
    public required decimal Profit { get; init; }
}
