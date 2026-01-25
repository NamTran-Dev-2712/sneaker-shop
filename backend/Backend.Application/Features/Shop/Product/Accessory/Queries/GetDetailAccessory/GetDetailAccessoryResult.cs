public record GetDetailAccessoryResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string MainImage { get; init; }
    public string? Description { get; init; }
    public decimal? BasePrice { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
    public required AccessoryDetailCategoryDto Category { get; init; }
    public required AccessoryDetailBrandDto Brand { get; init; }
    public required List<AccessoryDetailImageDto> Images { get; init; }
    public AccessoryDetailSellableItemDto? SellableItem { get; init; }
}

public record AccessoryDetailCategoryDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
}

public record AccessoryDetailBrandDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string ThumbnailUrl { get; init; }
}

public record AccessoryDetailImageDto
{
    public required int Id { get; init; }
    public required string ImageUrl { get; init; }
    public required DateTime CreatedAt { get; init; }
}

public record AccessoryDetailSellableItemDto
{
    public required int Id { get; init; }
    public required string Sku { get; init; }
    public string? Barcode { get; init; }
    public decimal? RetailPrice { get; init; }
    public decimal? OnlinePrice { get; init; }
    public required bool IsActive { get; init; }
    public AccessoryDetailInventoryDto? Inventory { get; init; }
}

public record AccessoryDetailInventoryDto
{
    public required int OnHand { get; init; }
    public required int Reserved { get; init; }
    public int Available => OnHand - Reserved;
    public required string StoreName { get; init; }
}
