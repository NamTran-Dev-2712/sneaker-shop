using MediatR;

public record DeliverStoreOrderCommand : IRequest<DeliverStoreOrderResult>
{
    public required int StoreId { get; init; }
    public required int StaffAccountId { get; init; }
    public required int OrderId { get; init; }
}
