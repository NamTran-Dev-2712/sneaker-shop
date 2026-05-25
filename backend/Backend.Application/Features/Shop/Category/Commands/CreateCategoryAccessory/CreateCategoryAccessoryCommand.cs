using MediatR;
using Microsoft.AspNetCore.Http;

public record CreateCategoryAccessoryCommand : IRequest<CreateCategoryAccessoryResult>
{
    public required string Name { get; init; }
    public List<CreateBrandInput> Brands { get; init; } = new();
}

public record CreateBrandInput
{
    public required string Name { get; init; }
    public required IFormFile ThumbnailImage { get; init; }
}
