public class GetCartResult : BaseGetResponse<CartItemDto>
{
    public required int CartId { get; init; }
    public required int CustomerId { get; init; }
    public required int TotalQuantity { get; init; }
    public required decimal SubTotal { get; init; }
    public required DateTime UpdatedAt { get; init; }
}

public record CartItemDto
{
    public required int CartItemId { get; init; }
    public required int SellableItemId { get; init; }
    public required int InventoryId { get; init; }
    public required int Quantity { get; init; }

    // Product information
    public required SellableType ProductType { get; init; }
    public required string ProductName { get; init; }
    public required string? ProductSlug { get; init; }
    public required string Sku { get; init; }
    public required string MainImage { get; init; }
    public required decimal UnitPrice { get; init; }
    public required decimal LineTotal { get; init; }

    // Variant-specific info (for sneakers)
    public string? ColorName { get; init; }
    public string? ColorHex { get; init; }
    public string? SizeName { get; init; }
    public string? BrandName { get; init; }

    // Inventory info for frontend validation
    public required InventoryInfoDto SelectedInventory { get; init; }
    public required int TotalAvailableAcrossStores { get; init; }
    public required List<InventoryInfoDto> AvailableInventories { get; init; }

    // Status
    public required bool IsAvailable { get; init; }
    public required string? UnavailableReason { get; init; }
}

public record InventoryInfoDto
{
    public required int InventoryId { get; init; }
    public required int StoreId { get; init; }
    public required string StoreName { get; init; }
    public required int OnHand { get; init; }
    public required int Reserved { get; init; }
    public required int Available { get; init; }
}
