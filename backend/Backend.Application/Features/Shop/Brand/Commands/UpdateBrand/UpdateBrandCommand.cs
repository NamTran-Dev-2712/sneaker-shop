using MediatR;
using Microsoft.AspNetCore.Http;

public record UpdateBrandCommand : IRequest<UpdateBrandResult>
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public IFormFile? Logo { get; init; }
    public required bool IsActive { get; init; }
}
