using MediatR;

public record GetStoreDetailQuery : IRequest<GetStoreDetailResult>
{
    public required int Id { get; init; }
}
