using MediatR;

public record ConfirmStoreOrderCommand : IRequest<ConfirmStoreOrderResult>
{
    public required int StoreId { get; init; }
    public required int StaffAccountId { get; init; }
    public required int OrderId { get; init; }
}
