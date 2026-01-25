using MediatR;

public record UpdateStatusPurchaseOrderCommand : IRequest<UpdateStatusPurchaseOrderResult>
{
    public required int Id { get; init; }
    public required PurchaseStatus NewStatus { get; init; }
}
