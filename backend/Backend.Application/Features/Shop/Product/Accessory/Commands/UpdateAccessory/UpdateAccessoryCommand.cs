using MediatR;
using Microsoft.AspNetCore.Http;

public record UpdateAccessoryCommand : IRequest<UpdateAccessoryResult>
{
    public required int Id { get; init; }
    public int? CategoryId { get; init; }
    public int? BrandId { get; init; }
    public string? Name { get; init; }
    public string? Description { get; init; }
    public IFormFile? MainImage { get; init; }
    public List<IFormFile>? ImagesToAdd { get; init; }
    public List<int>? ImageIdsToRemove { get; init; }
    public decimal? RetailPrice { get; init; }
    public decimal? OnlinePrice { get; init; }
}
