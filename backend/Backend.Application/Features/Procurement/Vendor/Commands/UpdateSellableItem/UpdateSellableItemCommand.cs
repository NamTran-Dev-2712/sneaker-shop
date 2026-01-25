using MediatR;

public record UpdateSellableItemCommand : IRequest<UpdateSellableItemResult>
{
    public required int Id { get; init; } // VendorPrice Id
    public required int VendorId { get; init; }
    public required decimal Price { get; init; }
    public required DateTime EffectiveFrom { get; init; }
    public DateTime? EffectiveTo { get; init; }
}
