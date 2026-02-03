using MediatR;

public record ClearCartCommand : IRequest<ClearCartResult>
{
    public required int CustomerId { get; init; }
}
