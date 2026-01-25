using MediatR;

public record GetInventoryStatisticQuery : IRequest<GetInventoryStatisticResult>
{
    public int? StoreId { get; init; }
    public SellableType? SellableType { get; init; }
    public int LowStockThreshold { get; init; } = 10;
}
