using MediatR;

public record DeleteCategoryAccessoryCommand : IRequest<DeleteCategoryAccessoryResult>
{
    public required int Id { get; init; }
}
