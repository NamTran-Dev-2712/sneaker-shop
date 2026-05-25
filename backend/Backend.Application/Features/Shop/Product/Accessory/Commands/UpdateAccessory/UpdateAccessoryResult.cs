public record UpdateAccessoryResult
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
    public required DateTime UpdatedAt { get; init; }
    public int ImagesAdded { get; init; }
    public int ImagesRemoved { get; init; }
}
