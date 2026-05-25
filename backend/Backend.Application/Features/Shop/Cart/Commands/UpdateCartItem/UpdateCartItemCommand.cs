using MediatR;

public record UpdateCartItemCommand : IRequest<UpdateCartItemResult>
{
    // CustomerId is set by the controller from JWT token, not from client
    public int CustomerId { get; init; }

    public required int CartItemId { get; init; }

    public required int Quantity { get; init; }

    public int? InventoryId { get; init; }
}
