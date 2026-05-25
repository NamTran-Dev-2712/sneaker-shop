using MediatR;

public record GetFinanceSummaryQuery : IRequest<GetFinanceSummaryResult>
{
    public int? StoreId { get; init; }
    public DateTime? FromDate { get; init; }
    public DateTime? ToDate { get; init; }
}
