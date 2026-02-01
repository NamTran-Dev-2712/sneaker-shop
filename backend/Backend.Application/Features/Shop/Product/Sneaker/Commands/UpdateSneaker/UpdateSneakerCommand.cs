using MediatR;
using Microsoft.AspNetCore.Http;

public record UpdateSneakerCommand : IRequest<UpdateSneakerResult>
{
    // Basic sneaker info
    public required int Id { get; init; }
    public required int BrandId { get; init; }
    public required int BrandSeriesId { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public IFormFile? MainImage { get; init; }
    public required bool IsActive { get; init; }

    // SubImages management
    public List<IFormFile>? NewSubImages { get; init; } // Add new sub-images
    public List<int>? RemoveSubImageIds { get; init; } // Remove existing sub-images by ID

    // Colorway management
    public List<int>? RemoveColorwayIds { get; init; } // Remove existing colorways by ID

    // Optional: Colorway changes (add new or update existing)
    public List<UpdateColorwayInput>? Colorways { get; init; }
}

public record UpdateColorwayInput
{
    public int? Id { get; init; }
    public int? ColorId { get; init; }
    public CreateInlineColorInput? NewColor { get; init; }
    public IFormFile? CoverImage { get; init; }

    public bool? IsActive { get; init; }
    public List<UpdateVariantInput>? Variants { get; init; }
    public List<int>? RemoveVariantIds { get; init; } // Remove existing variants by ID
}

public record UpdateVariantInput
{
    public int? Id { get; init; }
    public int? SizeId { get; init; }
    public decimal? RetailPrice { get; init; }
    public decimal? OnlinePrice { get; init; }
    public bool? IsActive { get; init; }
}
