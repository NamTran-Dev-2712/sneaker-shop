using MediatR;

public record ShipStoreOrderCommand : IRequest<ShipStoreOrderResult>
{
    public required int StoreId { get; init; }
    public required int StaffAccountId { get; init; }
    public required int OrderId { get; init; }
    public string? Carrier { get; init; }
    public string? TrackingCode { get; init; }
}
