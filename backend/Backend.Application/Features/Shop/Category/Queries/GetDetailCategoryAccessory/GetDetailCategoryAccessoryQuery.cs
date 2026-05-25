using MediatR;

public record GetDetailCategoryAccessoryQuery : IRequest<GetDetailCategoryAccessoryResult>
{
    public required int Id { get; init; }
}
