using MediatR;
using Microsoft.AspNetCore.Http;

public record UpdateSlideCommand : IRequest<UpdateSlideResult>
{
    public required int Id { get; init; }
    public required string Title { get; init; }
    public required string Subtitle { get; init; }
    public required string Description { get; init; }
    public IFormFile? Image { get; init; }
    public required string ButtonText { get; init; }
    public required string ButtonUrl { get; init; }
}
