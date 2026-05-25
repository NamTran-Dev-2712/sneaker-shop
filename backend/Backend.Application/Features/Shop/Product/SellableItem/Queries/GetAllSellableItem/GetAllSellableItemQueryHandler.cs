using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetAllSellableItemQueryHandler
    : IRequestHandler<GetAllSellableItemQuery, List<GetAllSellableItemResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAllSellableItemQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<GetAllSellableItemResult>> Handle(
        GetAllSellableItemQuery query,
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

        // Search by SKU or ProductName
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLower();
            baseQuery = baseQuery.Where(s =>
                s.Sku.ToLower().Contains(searchLower)
                || (
                    s.SneakerVariant != null
                    && s.SneakerVariant.Colorway.Sneaker.Name.ToLower().Contains(searchLower)
                )
                || (s.Accessory != null && s.Accessory.Name.ToLower().Contains(searchLower))
            );
        }

        return await baseQuery
            .OrderBy(s => s.Sku)
            .Select(s => new GetAllSellableItemResult
            {
                Id = s.Id,
                Type = s.Type,
                Sku = s.Sku,
                ProductName =
                    s.SneakerVariant != null ? s.SneakerVariant.Colorway.Sneaker.Name
                    : s.Accessory != null ? s.Accessory.Name
                    : "Unknown",
                ColorName = s.SneakerVariant != null ? s.SneakerVariant.Colorway.Color.Name : null,
                SizeName =
                    s.SneakerVariant != null
                        ? s.SneakerVariant.Size.System + " " + s.SneakerVariant.Size.Value
                        : null,
                RetailPrice = s.RetailPrice,
                OnlinePrice = s.OnlinePrice,
                IsActive = s.IsActive,
            })
            .ToListAsync(cancellationToken);
    }
}
