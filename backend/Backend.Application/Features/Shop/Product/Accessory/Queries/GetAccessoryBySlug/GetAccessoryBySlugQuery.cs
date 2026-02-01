using MediatR;

public record GetAccessoryBySlugQuery : IRequest<GetDetailAccessoryResult>
{
    public required string Slug { get; init; }
}
