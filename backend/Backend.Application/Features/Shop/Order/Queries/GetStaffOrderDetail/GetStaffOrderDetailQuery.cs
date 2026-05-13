using MediatR;

public record GetStaffOrderDetailQuery : IRequest<GetStaffOrderDetailResult>
{
    public required int StoreId { get; init; }
    public required int OrderId { get; init; }
}
