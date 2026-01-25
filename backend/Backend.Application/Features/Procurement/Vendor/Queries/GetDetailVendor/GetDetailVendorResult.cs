public record GetDetailVendorResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Phone { get; init; }
    public required string Email { get; init; }
    public string? Address { get; init; }
    public required bool IsActive { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
    public required int TotalPurchaseOrders { get; init; }
    public required int PendingPurchaseOrders { get; init; }
    public required List<VendorPriceDto> VendorPrices { get; init; }
}

public record VendorPriceDto
{
    public required int Id { get; init; }
    public required int SellableItemId { get; init; }
    public required string Sku { get; init; }
    public required string ProductName { get; init; }
    public required SellableType ProductType { get; init; }
    public required decimal Price { get; init; }
    public required DateTime EffectiveFrom { get; init; }
    public DateTime? EffectiveTo { get; init; }
    public required bool IsCurrentlyEffective { get; init; }
}
