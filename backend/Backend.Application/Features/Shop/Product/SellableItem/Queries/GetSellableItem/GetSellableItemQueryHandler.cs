using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetSellableItemQueryHandler
    : IRequestHandler<GetSellableItemQuery, BaseGetResponse<GetSellableItemResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetSellableItemQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetSellableItemResult>> Handle(
        GetSellableItemQuery query,
        CancellationToken cancellationToken
    )
    {
        var baseQuery = _unitOfWork.SellableItems.Query().AsNoTracking();

        // Filter by Type
        if (query.Type.HasValue)
        {
            baseQuery = baseQuery.Where(s => s.Type == query.Type);
        }

        // Filter by IsActive
        if (query.IsActive.HasValue)
        {
            baseQuery = baseQuery.Where(s => s.IsActive == query.IsActive);
        }

        // Filter by BrandId
        if (query.BrandId.HasValue)
        {
            baseQuery = baseQuery.Where(s =>
                (
                    s.SneakerVariant != null
                    && s.SneakerVariant.Colorway.Sneaker.BrandId == query.BrandId
                ) || (s.Accessory != null && s.Accessory.BrandId == query.BrandId)
            );
        }

        // Filter by CategoryId (for Accessory)
        if (query.CategoryId.HasValue)
        {
            baseQuery = baseQuery.Where(s =>
                s.Accessory != null && s.Accessory.CategoryId == query.CategoryId
            );
        }

        // Filter by Store (has inventory in specific store)
        if (query.StoreId.HasValue)
        {
            baseQuery = baseQuery.Where(s =>
                s.Inventories.Any(inv =>
                    inv.StoreId == query.StoreId && inv.OnHand - inv.Reserved > 0
                )
            );
        }

        // Filter by HasInventory
        if (query.HasInventory == true)
        {
            baseQuery = baseQuery.Where(s =>
                s.Inventories.Any(inv => inv.OnHand - inv.Reserved > 0)
            );
        }
        else if (query.HasInventory == false)
        {
            baseQuery = baseQuery.Where(s =>
                !s.Inventories.Any() || s.Inventories.All(inv => inv.OnHand - inv.Reserved <= 0)
            );
        }

        // Search by SKU, Barcode, ProductName
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLower();
            baseQuery = baseQuery.Where(s =>
                s.Sku.ToLower().Contains(searchLower)
                || (s.Barcode != null && s.Barcode.ToLower().Contains(searchLower))
                || (
                    s.SneakerVariant != null
                    && s.SneakerVariant.Colorway.Sneaker.Name.ToLower().Contains(searchLower)
                )
                || (s.Accessory != null && s.Accessory.Name.ToLower().Contains(searchLower))
            );
        }

        // Get total count
        var totalItems = await baseQuery.CountAsync(cancellationToken);

        // Apply sorting
        baseQuery = query.SortBy?.ToLower() switch
        {
            "sku" => query.IsSortDescending
                ? baseQuery.OrderByDescending(s => s.Sku)
                : baseQuery.OrderBy(s => s.Sku),
            "name" => query.IsSortDescending
                ? baseQuery.OrderByDescending(s =>
                    s.SneakerVariant != null ? s.SneakerVariant.Colorway.Sneaker.Name
                    : s.Accessory != null ? s.Accessory.Name
                    : ""
                )
                : baseQuery.OrderBy(s =>
                    s.SneakerVariant != null ? s.SneakerVariant.Colorway.Sneaker.Name
                    : s.Accessory != null ? s.Accessory.Name
                    : ""
                ),
            "retailprice" => query.IsSortDescending
                ? baseQuery.OrderByDescending(s => s.RetailPrice)
                : baseQuery.OrderBy(s => s.RetailPrice),
            "onlineprice" => query.IsSortDescending
                ? baseQuery.OrderByDescending(s => s.OnlinePrice)
                : baseQuery.OrderBy(s => s.OnlinePrice),
            "inventory" => query.IsSortDescending
                ? baseQuery.OrderByDescending(s => s.Inventories.Sum(i => i.OnHand - i.Reserved))
                : baseQuery.OrderBy(s => s.Inventories.Sum(i => i.OnHand - i.Reserved)),
            _ => query.IsSortDescending
                ? baseQuery.OrderByDescending(s => s.CreatedAt)
                : baseQuery.OrderBy(s => s.CreatedAt),
        };

        // Apply pagination and projection
        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(s => new GetSellableItemResult
            {
                Id = s.Id,
                Type = s.Type,
                Sku = s.Sku,
                Barcode = s.Barcode,
                ProductName =
                    s.SneakerVariant != null ? s.SneakerVariant.Colorway.Sneaker.Name
                    : s.Accessory != null ? s.Accessory.Name
                    : "Unknown",
                ProductImage =
                    s.SneakerVariant != null ? s.SneakerVariant.Colorway.CoverImage
                    : s.Accessory != null ? s.Accessory.MainImage
                    : "",
                BrandName =
                    s.SneakerVariant != null ? s.SneakerVariant.Colorway.Sneaker.Brand.Name
                    : s.Accessory != null ? s.Accessory.Brand.Name
                    : null,
                CategoryName = s.Accessory != null ? s.Accessory.Category.Name : null,
                ColorName = s.SneakerVariant != null ? s.SneakerVariant.Colorway.Color.Name : null,
                SizeName =
                    s.SneakerVariant != null
                        ? s.SneakerVariant.Size.System + " " + s.SneakerVariant.Size.Value
                        : null,
                RetailPrice = s.RetailPrice,
                OnlinePrice = s.OnlinePrice,
                IsActive = s.IsActive,
                TotalInventory = s.Inventories.Sum(i => i.OnHand - i.Reserved),
                CreatedAt = s.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        var totalPages = (int)Math.Ceiling((double)totalItems / query.PageSize);

        return new BaseGetResponse<GetSellableItemResult>
        {
            Items = items,
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
        };
    }
}
