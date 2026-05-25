using MediatR;

public record GetFinanceTrendQuery : IRequest<List<FinanceTrendPointResult>>
{
    public int? StoreId { get; init; }
    public DateTime? FromDate { get; init; }
    public DateTime? ToDate { get; init; }
}
