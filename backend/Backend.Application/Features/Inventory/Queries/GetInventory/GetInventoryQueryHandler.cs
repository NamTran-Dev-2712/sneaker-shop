using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetInventoryQueryHandler
    : IRequestHandler<GetInventoryQuery, BaseGetResponse<GetInventoryResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetInventoryQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetInventoryResult>> Handle(
        GetInventoryQuery query,
        CancellationToken cancellationToken
    )
    {
        var baseQuery = _unitOfWork.Inventories.Query().AsNoTracking();

        // Apply filters
        if (query.StoreId.HasValue)
        {
            baseQuery = baseQuery.Where(inv => inv.StoreId == query.StoreId);
        }

        if (query.SellableItemId.HasValue)
        {
            baseQuery = baseQuery.Where(inv => inv.SellableItemId == query.SellableItemId);
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

        if (query.LowStock == true)
        {
            baseQuery = baseQuery.Where(inv =>
                inv.OnHand - inv.Reserved <= query.LowStockThreshold
            );
        }

        // Search by product name, SKU, store name
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLower();
            baseQuery = baseQuery.Where(inv =>
                inv.Store.Name.ToLower().Contains(searchLower)
                || inv.SellableItem.Sku.ToLower().Contains(searchLower)
                || (
                    inv.SellableItem.SneakerVariant != null
                    && inv.SellableItem.SneakerVariant.Colorway.Sneaker.Name.ToLower()
                        .Contains(searchLower)
                )
                || (
                    inv.SellableItem.Accessory != null
                    && inv.SellableItem.Accessory.Name.ToLower().Contains(searchLower)
                )
            );
        }

        // Get total count
        var totalItems = await baseQuery.CountAsync(cancellationToken);

        // Apply sorting
        baseQuery = query.SortBy?.ToLower() switch
        {
            "store" => query.IsSortDescending
                ? baseQuery.OrderByDescending(inv => inv.Store.Name)
                : baseQuery.OrderBy(inv => inv.Store.Name),
            "product" => query.IsSortDescending
                ? baseQuery.OrderByDescending(inv =>
                    inv.SellableItem.SneakerVariant != null
                        ? inv.SellableItem.SneakerVariant.Colorway.Sneaker.Name
                    : inv.SellableItem.Accessory != null ? inv.SellableItem.Accessory.Name
                    : ""
                )
                : baseQuery.OrderBy(inv =>
                    inv.SellableItem.SneakerVariant != null
                        ? inv.SellableItem.SneakerVariant.Colorway.Sneaker.Name
                    : inv.SellableItem.Accessory != null ? inv.SellableItem.Accessory.Name
                    : ""
                ),
            "onhand" => query.IsSortDescending
                ? baseQuery.OrderByDescending(inv => inv.OnHand)
                : baseQuery.OrderBy(inv => inv.OnHand),
            "reserved" => query.IsSortDescending
                ? baseQuery.OrderByDescending(inv => inv.Reserved)
                : baseQuery.OrderBy(inv => inv.Reserved),
            "available" => query.IsSortDescending
                ? baseQuery.OrderByDescending(inv => inv.OnHand - inv.Reserved)
                : baseQuery.OrderBy(inv => inv.OnHand - inv.Reserved),
            _ => query.IsSortDescending
                ? baseQuery.OrderByDescending(inv => inv.UpdatedAt)
                : baseQuery.OrderBy(inv => inv.UpdatedAt),
        };

        // Apply pagination and projection
        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(inv => new GetInventoryResult
            {
                Id = inv.Id,
                StoreId = inv.StoreId,
                StoreName = inv.Store.Name,
                SellableItemId = inv.SellableItemId,
                ProductName =
                    inv.SellableItem.SneakerVariant != null
                        ? inv.SellableItem.SneakerVariant.Colorway.Sneaker.Name
                    : inv.SellableItem.Accessory != null ? inv.SellableItem.Accessory.Name
                    : "Unknown",
                SellableType =
                    inv.SellableItem.SneakerVariant != null
                        ? SellableType.SNEAKER_VARIANT
                        : SellableType.ACCESSORY,
                SKU = inv.SellableItem.Sku,
                ColorName =
                    inv.SellableItem.SneakerVariant != null
                        ? inv.SellableItem.SneakerVariant.Colorway.Color.Name
                        : null,
                SizeName =
                    inv.SellableItem.SneakerVariant != null
                        ? inv.SellableItem.SneakerVariant.Size.System
                            + " "
                            + inv.SellableItem.SneakerVariant.Size.Value
                        : null,
                OnHand = inv.OnHand,
                Reserved = inv.Reserved,
                Available = inv.OnHand - inv.Reserved,
                UpdatedAt = inv.UpdatedAt,
            })
            .ToListAsync(cancellationToken);

        var totalPages = (int)Math.Ceiling((double)totalItems / query.PageSize);

        return new BaseGetResponse<GetInventoryResult>
        {
            Items = items,
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
        };
    }
}
