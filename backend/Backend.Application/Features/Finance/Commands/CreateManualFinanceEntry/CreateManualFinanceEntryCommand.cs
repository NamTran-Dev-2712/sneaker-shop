using MediatR;

public record CreateManualFinanceEntryCommand : IRequest<CreateManualFinanceEntryResult>
{
    public required FinanceEntryStatus Status { get; init; }
    public required decimal Amount { get; init; }
    public required string Category { get; init; }
    public string? Description { get; init; }
    public int? StoreId { get; init; }
    public DateTime? OccurredAt { get; init; }
    public int? CreatedBy { get; init; }
}
