using MediatR;

public record MarkStoreOrderPaidCommand : IRequest<MarkStoreOrderPaidResult>
{
    public required int StoreId { get; init; }
    public required int StaffAccountId { get; init; }
    public required int OrderId { get; init; }
}
