using MediatR;

public record PackStoreOrderCommand : IRequest<PackStoreOrderResult>
{
    public required int StoreId { get; init; }
    public required int StaffAccountId { get; init; }
    public required int OrderId { get; init; }
}
