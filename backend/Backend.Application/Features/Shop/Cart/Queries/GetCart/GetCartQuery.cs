using MediatR;

public record GetCartQuery : IRequest<GetCartResult>
{
    public required int CustomerId { get; init; }
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
}
