using MediatR;

public record DeleteSizeCommand : IRequest<DeleteSizeResult>
{
    public required int Id { get; init; }
}
