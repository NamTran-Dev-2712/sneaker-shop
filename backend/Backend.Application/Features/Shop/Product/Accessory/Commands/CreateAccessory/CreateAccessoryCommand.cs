using MediatR;
using Microsoft.AspNetCore.Http;

public record CreateAccessoryCommand : IRequest<CreateAccessoryResult>
{
    public required int CategoryId { get; init; }
    public required int BrandId { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required IFormFile MainImage { get; init; }
    public List<IFormFile>? SubImages { get; init; }
    public decimal? RetailPrice { get; init; }
    public decimal? OnlinePrice { get; init; }
}
