using MediatR;

public record DeleteSlideCommand : IRequest<DeleteSlideResult>
{
    public required int Id { get; init; }
}
