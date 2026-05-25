using MediatR;

public record GetBrandDetailQuery : IRequest<GetBrandDetailResult>
{
    public required int Id { get; init; }
}
