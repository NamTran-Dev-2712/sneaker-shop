using MediatR;

public record UpdatePurchaseOrderCommand : IRequest<UpdatePurchaseOrderResult>
{
    public required int Id { get; init; }
    public DateTime? ExpectedAt { get; init; }
    public string? Note { get; init; }
    public required List<UpdatePurchaseOrderItemDto> Items { get; init; }
}

public record UpdatePurchaseOrderItemDto
{
    public int? Id { get; init; } // null for new items
    public required int SellableItemId { get; init; }
    public required int Quantity { get; init; }
    public required decimal UnitCost { get; init; }
}
