using MediatR;

public class GetStoreOrdersQuery : BaseGetRequest, IRequest<BaseGetResponse<GetStoreOrdersResult>>
{
    public required int StoreId { get; set; }
    public string? Status { get; set; }
    public string? PaymentStatus { get; set; }
    public string? FulfillmentType { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}
