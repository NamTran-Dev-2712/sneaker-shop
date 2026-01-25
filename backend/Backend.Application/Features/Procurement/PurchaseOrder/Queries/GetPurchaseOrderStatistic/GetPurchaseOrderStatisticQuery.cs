using MediatR;

public record GetPurchaseOrderStatisticQuery : IRequest<GetPurchaseOrderStatisticResult>
{
    public int? VendorId { get; init; }
    public int? StoreId { get; init; }
    public DateTime? FromDate { get; init; }
    public DateTime? ToDate { get; init; }
}
