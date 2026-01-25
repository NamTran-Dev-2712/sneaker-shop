using MediatR;

public record RemoveSellableItemCommand : IRequest<RemoveSellableItemResult>
{
    public required int Id { get; init; } // VendorPrice Id
    public required int VendorId { get; init; }
}
