using MediatR;
using Microsoft.AspNetCore.Http;

public record CreateSneakerCommand : IRequest<CreateSneakerResult>
{
    public required int BrandId { get; init; }
    public required int BrandSeriesId { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required IFormFile MainImage { get; init; }
    public List<IFormFile>? SubImages { get; init; } // Optional sub images
    public required List<CreateColorwayInput> Colorways { get; init; }
}

public record CreateColorwayInput
{
    public int? ColorId { get; init; }
    public CreateInlineColorInput? NewColor { get; init; }
    public required IFormFile CoverImage { get; init; }
    public required List<CreateVariantInput> Variants { get; init; }
}

public record CreateInlineColorInput
{
    public required string Name { get; init; }
    public required string Hex { get; init; }
}

public record CreateVariantInput
{
    public required int SizeId { get; init; }
    public decimal? RetailPrice { get; init; }
    public decimal? OnlinePrice { get; init; }
}
