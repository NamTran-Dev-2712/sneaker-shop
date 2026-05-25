using MediatR;

public record GetAllPurchaseOrderQuery : IRequest<List<GetAllPurchaseOrderResult>>
{
    public PurchaseStatus? Status { get; init; }
    public int? VendorId { get; init; }
    public int? StoreId { get; init; }
}
