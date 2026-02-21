using MediatR;

public record GetOrderDetailQuery : IRequest<GetOrderDetailResult>
{
    public required int CustomerId { get; init; }
    public required int OrderId { get; init; }
}
