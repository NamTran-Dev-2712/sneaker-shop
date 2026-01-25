public record AddSellableItemResult
{
    public required int Id { get; init; }
    public required int VendorId { get; init; }
    public required int SellableItemId { get; init; }
    public required string Sku { get; init; }
    public required decimal Price { get; init; }
    public required DateTime EffectiveFrom { get; init; }
    public DateTime? EffectiveTo { get; init; }
    public required DateTime CreatedAt { get; init; }
}
