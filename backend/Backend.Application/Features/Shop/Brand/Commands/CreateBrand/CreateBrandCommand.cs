using MediatR;
using Microsoft.AspNetCore.Http;

public record CreateBrandCommand : IRequest<CreateBrandResult>
{
    public required string Name { get; init; }
    public required IFormFile Logo { get; init; }
}
