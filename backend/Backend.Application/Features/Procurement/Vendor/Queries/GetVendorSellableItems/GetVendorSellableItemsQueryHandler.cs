using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetVendorSellableItemsQueryHandler
    : IRequestHandler<GetVendorSellableItemsQuery, BaseGetResponse<VendorSellableItemResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetVendorSellableItemsQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<VendorSellableItemResult>> Handle(
        GetVendorSellableItemsQuery query,
        CancellationToken cancellationToken
    )
    {
        // 1. Verify vendor exists
        var vendorExists = await _unitOfWork
            .Vendors.Query()
            .AnyAsync(v => v.Id == query.VendorId && !v.IsDeleted, cancellationToken);

        if (!vendorExists)
        {
            throw new NotFoundException("Không tìm thấy nhà cung cấp.");
        }

        // 2. Build base query
        var baseQuery = _unitOfWork
            .VendorPrices.Query()
            .AsNoTracking()
            .Where(vp => vp.VendorId == query.VendorId);

        // 3. Apply product type filter
        if (query.ProductType.HasValue)
        {
            baseQuery = baseQuery.Where(vp => vp.SellableItem.Type == query.ProductType.Value);
        }

        // 4. Apply currently effective filter
        if (query.IsCurrentlyEffective.HasValue && query.IsCurrentlyEffective.Value)
        {
            var now = DateTime.UtcNow;
            baseQuery = baseQuery.Where(vp =>
                vp.EffectiveFrom <= now && (vp.EffectiveTo == null || vp.EffectiveTo >= now)
            );
        }

        // 5. Apply search filter
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLower();
            baseQuery = baseQuery.Where(vp =>
                vp.SellableItem.Sku.ToLower().Contains(searchLower)
                || (
                    vp.SellableItem.SneakerVariant != null
                    && vp.SellableItem.SneakerVariant.Sneaker.Name.ToLower().Contains(searchLower)
                )
                || (
                    vp.SellableItem.Accessory != null
                    && vp.SellableItem.Accessory.Name.ToLower().Contains(searchLower)
                )
            );
        }

        // 6. Get total count
        var totalItems = await baseQuery.CountAsync(cancellationToken);

        // 7. Apply sorting
        baseQuery = ApplySorting(baseQuery, query.SortBy, query.SortOrder);

        // 8. Apply pagination and projection
        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(vp => new VendorSellableItemResult
            {
                VendorPriceId = vp.Id,
                SellableItemId = vp.SellableItemId,
                Sku = vp.SellableItem.Sku,
                Barcode = vp.SellableItem.Barcode,
                ProductType = vp.SellableItem.Type,
                ProductName =
                    vp.SellableItem.SneakerVariant != null
                        ? vp.SellableItem.SneakerVariant.Sneaker.Name
                    : vp.SellableItem.Accessory != null ? vp.SellableItem.Accessory.Name
                    : "Unknown",
                ProductImage =
                    vp.SellableItem.SneakerVariant != null
                        ? vp.SellableItem.SneakerVariant.Colorway.CoverImage
                    : vp.SellableItem.Accessory != null ? vp.SellableItem.Accessory.MainImage
                    : null,
                VariantInfo =
                    vp.SellableItem.SneakerVariant != null
                        ? new VariantInfoDto
                        {
                            ColorName = vp.SellableItem.SneakerVariant.Colorway.Color.Name,
                            ColorHex = vp.SellableItem.SneakerVariant.Colorway.Color.Hex,
                            SizeSystem = vp.SellableItem.SneakerVariant.Size.System,
                            SizeValue = vp.SellableItem.SneakerVariant.Size.Value,
                        }
                        : null,
                VendorPrice = vp.Price,
                RetailPrice = vp.SellableItem.RetailPrice,
                OnlinePrice = vp.SellableItem.OnlinePrice,
                EffectiveFrom = vp.EffectiveFrom,
                EffectiveTo = vp.EffectiveTo,
                IsCurrentlyEffective =
                    vp.EffectiveFrom <= DateTime.UtcNow
                    && (vp.EffectiveTo == null || vp.EffectiveTo >= DateTime.UtcNow),
                IsActive = vp.SellableItem.IsActive,
            })
            .ToListAsync(cancellationToken);

        // 9. Calculate pagination info
        var totalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize);

        return new BaseGetResponse<VendorSellableItemResult>
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
            Items = items,
        };
    }

    private static IQueryable<VendorPrice> ApplySorting(
        IQueryable<VendorPrice> query,
        string sortBy,
        string sortOrder
    )
    {
        var isDescending = sortOrder.Equals(SortOrder.DESC, StringComparison.OrdinalIgnoreCase);

        return sortBy.ToLower() switch
        {
            "sku" => isDescending
                ? query.OrderByDescending(vp => vp.SellableItem.Sku)
                : query.OrderBy(vp => vp.SellableItem.Sku),
            "price" => isDescending
                ? query.OrderByDescending(vp => vp.Price)
                : query.OrderBy(vp => vp.Price),
            "effectivefrom" => isDescending
                ? query.OrderByDescending(vp => vp.EffectiveFrom)
                : query.OrderBy(vp => vp.EffectiveFrom),
            "productname" => isDescending
                ? query.OrderByDescending(vp =>
                    vp.SellableItem.SneakerVariant != null
                        ? vp.SellableItem.SneakerVariant.Sneaker.Name
                    : vp.SellableItem.Accessory != null ? vp.SellableItem.Accessory.Name
                    : ""
                )
                : query.OrderBy(vp =>
                    vp.SellableItem.SneakerVariant != null
                        ? vp.SellableItem.SneakerVariant.Sneaker.Name
                    : vp.SellableItem.Accessory != null ? vp.SellableItem.Accessory.Name
                    : ""
                ),
            _ => query.OrderBy(vp => vp.SellableItem.Sku),
        };
    }
}
