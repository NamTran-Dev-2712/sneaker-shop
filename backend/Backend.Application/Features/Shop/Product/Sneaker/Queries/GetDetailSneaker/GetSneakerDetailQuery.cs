using MediatR;

public record GetSneakerDetailQuery : IRequest<GetSneakerDetailResult>
{
    public required int Id { get; init; }
}
