using MediatR;

public record CancelStoreOrderCommand : IRequest<CancelStoreOrderResult>
{
    public required int StoreId { get; init; }
    public required int StaffAccountId { get; init; }
    public required int OrderId { get; init; }
    public string? Reason { get; init; }
}
