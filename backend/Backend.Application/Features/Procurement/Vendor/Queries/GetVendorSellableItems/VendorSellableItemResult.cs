public record VendorSellableItemResult
{
    public required int VendorPriceId { get; init; }
    public required int SellableItemId { get; init; }
    public required string Sku { get; init; }
    public string? Barcode { get; init; }
    public required SellableType ProductType { get; init; }
    public required string ProductName { get; init; }
    public string? ProductImage { get; init; }
    public VariantInfoDto? VariantInfo { get; init; }
    public required decimal VendorPrice { get; init; }
    public decimal? RetailPrice { get; init; }
    public decimal? OnlinePrice { get; init; }
    public required DateTime EffectiveFrom { get; init; }
    public DateTime? EffectiveTo { get; init; }
    public required bool IsCurrentlyEffective { get; init; }
    public required bool IsActive { get; init; }
}

public record VariantInfoDto
{
    public required string ColorName { get; init; }
    public required string ColorHex { get; init; }
    public required string SizeSystem { get; init; }
    public required decimal SizeValue { get; init; }
}
