using MediatR;

public record GetDetailAccessoryQuery : IRequest<GetDetailAccessoryResult>
{
    public required int Id { get; init; }
}
