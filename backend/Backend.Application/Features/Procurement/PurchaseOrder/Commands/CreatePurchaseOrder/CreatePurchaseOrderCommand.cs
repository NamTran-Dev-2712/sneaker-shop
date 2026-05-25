using MediatR;

public record CreatePurchaseOrderCommand : IRequest<CreatePurchaseOrderResult>
{
    public required int VendorId { get; init; }
    public required int StoreId { get; init; }
    public DateTime? ExpectedAt { get; init; }
    public string? Note { get; init; }
    public required List<PurchaseOrderItemDto> Items { get; init; }
}

public record PurchaseOrderItemDto
{
    public required int SellableItemId { get; init; }
    public required int Quantity { get; init; }
    public required decimal UnitCost { get; init; }
}
