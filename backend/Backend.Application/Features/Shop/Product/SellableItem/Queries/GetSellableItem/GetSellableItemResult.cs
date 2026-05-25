public record GetSellableItemResult
{
    public required int Id { get; init; }
    public required SellableType Type { get; init; }
    public required string Sku { get; init; }
    public string? Barcode { get; init; }
    public required string ProductName { get; init; }
    public required string ProductImage { get; init; }
    public string? BrandName { get; init; }
    public string? CategoryName { get; init; }
    public string? ColorName { get; init; }
    public string? SizeName { get; init; }
    public decimal? RetailPrice { get; init; }
    public decimal? OnlinePrice { get; init; }
    public required bool IsActive { get; init; }
    public int TotalInventory { get; init; } // Tổng tồn kho tại tất cả cửa hàng
    public required DateTime CreatedAt { get; init; }
}
