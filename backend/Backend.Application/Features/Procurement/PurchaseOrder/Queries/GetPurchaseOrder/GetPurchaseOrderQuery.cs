using MediatR;

public class GetPurchaseOrderQuery
    : BaseGetRequest,
        IRequest<BaseGetResponse<GetPurchaseOrderResult>>
{
    public int? VendorId { get; set; }
    public int? StoreId { get; set; }
    public PurchaseStatus? Status { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string? SortBy { get; set; }
    public bool IsSortDescending { get; set; } = true;
}
