using MediatR;
using Microsoft.AspNetCore.Http;

public record UpdateCategoryAccessoryCommand : IRequest<UpdateCategoryAccessoryResult>
{
    public required int Id { get; init; }
    public string? Name { get; init; }
    public List<CreateBrandUpdateInput> BrandsToAdd { get; init; } = new();
    public List<UpdateBrandInput> BrandsToUpdate { get; init; } = new();
    public List<int> BrandIdsToRemove { get; init; } = new();
}

public record CreateBrandUpdateInput
{
    public required string Name { get; init; }
    public required IFormFile ThumbnailImage { get; init; }
}

public record UpdateBrandInput
{
    public required int Id { get; init; }
    public string? Name { get; init; }
    public IFormFile? ThumbnailImage { get; init; }
}
