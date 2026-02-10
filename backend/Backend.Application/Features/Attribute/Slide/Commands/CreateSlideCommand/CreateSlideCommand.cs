using MediatR;
using Microsoft.AspNetCore.Http;

public record CreateSlideCommand : IRequest<CreateSlideResult>
{
    public required string Title { get; init; }
    public required string Subtitle { get; init; }
    public required string Description { get; init; }
    public required IFormFile Image { get; init; }
    public required string ButtonText { get; init; }
    public required string ButtonUrl { get; init; }
}
