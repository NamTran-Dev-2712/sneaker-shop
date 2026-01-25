using MediatR;

public record AddSellableItemCommand : IRequest<AddSellableItemResult>
{
    public required int VendorId { get; init; }
    public required int SellableItemId { get; init; }
    public required decimal Price { get; init; }
    public required DateTime EffectiveFrom { get; init; }
    public DateTime? EffectiveTo { get; init; }
}
