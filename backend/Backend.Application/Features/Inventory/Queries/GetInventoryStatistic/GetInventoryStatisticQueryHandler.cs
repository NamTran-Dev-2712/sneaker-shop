using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetInventoryStatisticQueryHandler
    : IRequestHandler<GetInventoryStatisticQuery, GetInventoryStatisticResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetInventoryStatisticQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetInventoryStatisticResult> Handle(
        GetInventoryStatisticQuery query,
        CancellationToken cancellationToken
    )
    {
        var baseQuery = _unitOfWork.Inventories.Query().AsNoTracking();

        // Apply filters
        if (query.StoreId.HasValue)
        {
            baseQuery = baseQuery.Where(inv => inv.StoreId == query.StoreId);
        }

        if (query.SellableType.HasValue)
        {
            if (query.SellableType == SellableType.SNEAKER_VARIANT)
            {
                baseQuery = baseQuery.Where(inv => inv.SellableItem.SneakerVariant != null);
            }
            else
            {
                baseQuery = baseQuery.Where(inv => inv.SellableItem.Accessory != null);
            }
        }

        var stats = await baseQuery
            .GroupBy(_ => 1)
            .Select(g => new
            {
                TotalItems = g.Count(),
                TotalOnHand = g.Sum(inv => inv.OnHand),
                TotalReserved = g.Sum(inv => inv.Reserved),
                TotalAvailable = g.Sum(inv => inv.OnHand - inv.Reserved),
                LowStockCount = g.Count(inv =>
                    inv.OnHand - inv.Reserved <= query.LowStockThreshold
                ),
                OutOfStockCount = g.Count(inv => inv.OnHand - inv.Reserved <= 0),
                SneakerCount = g.Count(inv => inv.SellableItem.SneakerVariant != null),
                AccessoryCount = g.Count(inv => inv.SellableItem.Accessory != null),
            })
            .FirstOrDefaultAsync(cancellationToken);

        // Get store count with inventory
        var storesWithInventory = await baseQuery
            .Select(inv => inv.StoreId)
            .Distinct()
            .CountAsync(cancellationToken);

        return new GetInventoryStatisticResult
        {
            TotalItems = stats?.TotalItems ?? 0,
            TotalOnHand = stats?.TotalOnHand ?? 0,
            TotalReserved = stats?.TotalReserved ?? 0,
            TotalAvailable = stats?.TotalAvailable ?? 0,
            LowStockCount = stats?.LowStockCount ?? 0,
            OutOfStockCount = stats?.OutOfStockCount ?? 0,
            SneakerCount = stats?.SneakerCount ?? 0,
            AccessoryCount = stats?.AccessoryCount ?? 0,
            StoresWithInventory = storesWithInventory,
        };
    }
}
