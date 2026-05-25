using MediatR;

public record AddToCartCommand : IRequest<AddToCartResult>
{
    // CustomerId is set by the controller from JWT token, not from client
    public int CustomerId { get; init; }

    public required int SellableItemId { get; init; }

    public required int InventoryId { get; init; }

    public required int Quantity { get; init; }
}
