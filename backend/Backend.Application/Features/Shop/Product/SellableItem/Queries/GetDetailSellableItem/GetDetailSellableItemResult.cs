public record GetDetailSellableItemResult
{
    public required int Id { get; init; }
    public required SellableType Type { get; init; }
    public required string Sku { get; init; }
    public string? Barcode { get; init; }
    public decimal? RetailPrice { get; init; }
    public decimal? OnlinePrice { get; init; }
    public required bool IsActive { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }

    // Product info
    public ProductInfo? Product { get; init; }

    // Inventory by store
    public List<StoreInventoryInfo> Inventories { get; init; } = new();

    // Vendor prices
    public List<VendorPriceInfo> VendorPrices { get; init; } = new();
}

public record ProductInfo
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Image { get; init; }
    public string? BrandName { get; init; }
    public string? CategoryName { get; init; }
    public string? ColorName { get; init; }
    public string? SizeName { get; init; }
    public string? Description { get; init; }
}

public record StoreInventoryInfo
{
    public required int Id { get; init; }
    public required int StoreId { get; init; }
    public required string StoreName { get; init; }
    public required int OnHand { get; init; }
    public required int Reserved { get; init; }
    public required int Available { get; init; }
}

public record VendorPriceInfo
{
    public required int Id { get; init; }
    public required int VendorId { get; init; }
    public required string VendorName { get; init; }
    public required decimal Cost { get; init; }
    public required DateTime EffectiveFrom { get; init; }
    public DateTime? EffectiveTo { get; init; }
    public required bool IsCurrentlyEffective { get; init; }
}
