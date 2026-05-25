using MediatR;

public record DeleteColorCommand : IRequest<DeleteColorResult>
{
    public required int Id { get; init; }
}
