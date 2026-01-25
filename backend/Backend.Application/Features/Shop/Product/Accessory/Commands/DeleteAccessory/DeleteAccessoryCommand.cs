using MediatR;

public record DeleteAccessoryCommand : IRequest<DeleteAccessoryResult>
{
    public required int Id { get; init; }
}
