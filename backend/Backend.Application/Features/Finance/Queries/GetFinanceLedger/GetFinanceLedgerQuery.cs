using MediatR;

public class GetFinanceLedgerQuery
    : BaseGetRequest,
        IRequest<BaseGetResponse<GetFinanceLedgerItemResult>>
{
    public int? StoreId { get; set; }
    public FinanceEntryStatus? Status { get; set; }
    public FinanceEntrySourceType? SourceType { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public decimal? MinAmount { get; set; }
    public decimal? MaxAmount { get; set; }
    public string? SortBy { get; set; }
    public bool IsSortDescending { get; set; } = true;
}
