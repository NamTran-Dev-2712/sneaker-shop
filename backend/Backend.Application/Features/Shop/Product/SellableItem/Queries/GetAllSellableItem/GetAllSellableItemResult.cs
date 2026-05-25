public record GetAllSellableItemResult
{
    public required int Id { get; init; }
    public required SellableType Type { get; init; }
    public required string Sku { get; init; }
    public required string ProductName { get; init; }
    public string? ColorName { get; init; }
    public string? SizeName { get; init; }
    public decimal? RetailPrice { get; init; }
    public decimal? OnlinePrice { get; init; }
    public required bool IsActive { get; init; }
}
