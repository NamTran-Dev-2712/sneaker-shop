using MediatR;

public record RemoveItemCartCommand : IRequest<RemoveItemCartResult>
{
    public required int CustomerId { get; init; }

    public required int CartItemId { get; init; }
}
