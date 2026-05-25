using MediatR;

public record DeleteStoreCommand : IRequest<DeleteStoreResult>
{
    public required int Id { get; init; }
}
