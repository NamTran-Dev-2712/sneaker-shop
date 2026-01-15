using MediatR;

public record DeleteSneakerCommand : IRequest<DeleteSneakerResult>
{
    public required int Id { get; init; }
}
