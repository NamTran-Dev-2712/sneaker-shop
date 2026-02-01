using MediatR;

public record GetSneakerBySlugQuery : IRequest<GetSneakerDetailResult>
{
    public required string Slug { get; init; }
}
