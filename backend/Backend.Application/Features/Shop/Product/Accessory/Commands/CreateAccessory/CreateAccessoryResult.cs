public record CreateAccessoryResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string MainImage { get; init; }
    public string? Description { get; init; }
    public decimal? BasePrice { get; init; }
    public required AccessoryCategoryDto Category { get; init; }
    public required AccessoryBrandDto Brand { get; init; }
    public required List<AccessoryImageDto> SubImages { get; init; }
    public required AccessorySellableItemDto SellableItem { get; init; }
    public required DateTime CreatedAt { get; init; }
}

public record AccessoryCategoryDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
}

public record AccessoryBrandDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string ThumbnailUrl { get; init; }
}

public record AccessoryImageDto
{
    public required int Id { get; init; }
    public required string ImageUrl { get; init; }
}

public record AccessorySellableItemDto
{
    public required int Id { get; init; }
    public required string Sku { get; init; }
    public decimal? RetailPrice { get; init; }
    public decimal? OnlinePrice { get; init; }
    public required bool IsActive { get; init; }
}
