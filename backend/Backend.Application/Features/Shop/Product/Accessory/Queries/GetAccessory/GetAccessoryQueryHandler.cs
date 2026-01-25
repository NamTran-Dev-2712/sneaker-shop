using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetAccessoryQueryHandler
    : IRequestHandler<GetAccessoryQuery, BaseGetResponse<GetAccessoryResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAccessoryQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetAccessoryResult>> Handle(
        GetAccessoryQuery query,
        CancellationToken cancellationToken
    )
    {
        // 1. Build base query with AsNoTracking
        var baseQuery = _unitOfWork.Accessories.Query().AsNoTracking().Where(a => !a.IsDeleted);

        // 2. Apply search filter
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLower();
            baseQuery = baseQuery.Where(a =>
                a.Name.ToLower().Contains(searchLower)
                || a.Slug.ToLower().Contains(searchLower)
                || (a.Description != null && a.Description.ToLower().Contains(searchLower))
            );
        }

        // 3. Apply CategoryId filter
        if (query.CategoryId.HasValue)
        {
            baseQuery = baseQuery.Where(a => a.CategoryId == query.CategoryId.Value);
        }

        // 4. Apply BrandId filter
        if (query.BrandId.HasValue)
        {
            baseQuery = baseQuery.Where(a => a.BrandId == query.BrandId.Value);
        }

        // 5. Apply price range filter
        if (query.MinPrice.HasValue)
        {
            baseQuery = baseQuery.Where(a => a.BasePrice >= query.MinPrice.Value);
        }

        if (query.MaxPrice.HasValue)
        {
            baseQuery = baseQuery.Where(a => a.BasePrice <= query.MaxPrice.Value);
        }

        // 6. Apply IsActive filter (through SellableItem)
        if (query.IsActive.HasValue)
        {
            baseQuery = baseQuery.Where(a =>
                a.SellableItem != null && a.SellableItem.IsActive == query.IsActive.Value
            );
        }

        // 7. Get total count
        var totalItems = await baseQuery.CountAsync(cancellationToken);

        // 8. Apply sorting
        baseQuery = ApplySorting(baseQuery, query.SortBy, query.SortOrder);

        // 9. Apply pagination and projection
        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(a => new GetAccessoryResult
            {
                Id = a.Id,
                Name = a.Name,
                Slug = a.Slug,
                MainImage = a.MainImage,
                BasePrice = a.BasePrice,
                Category = new AccessoryListCategoryDto
                {
                    Id = a.Category.Id,
                    Name = a.Category.Name,
                },
                Brand = new AccessoryListBrandDto { Id = a.Brand.Id, Name = a.Brand.Name },
                ImageCount = a.Images.Count,
                IsActive = a.SellableItem != null && a.SellableItem.IsActive,
                CreatedAt = a.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        // 10. Calculate pagination info
        var totalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize);

        return new BaseGetResponse<GetAccessoryResult>
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
            Items = items,
        };
    }

    private static IQueryable<Accessory> ApplySorting(
        IQueryable<Accessory> query,
        string sortBy,
        string sortOrder
    )
    {
        var isDescending = sortOrder.Equals(
            global::SortOrder.DESC,
            StringComparison.OrdinalIgnoreCase
        );

        return sortBy.ToLower() switch
        {
            "name" => isDescending
                ? query.OrderByDescending(a => a.Name)
                : query.OrderBy(a => a.Name),
            "price" => isDescending
                ? query.OrderByDescending(a => a.BasePrice)
                : query.OrderBy(a => a.BasePrice),
            "createdat" => isDescending
                ? query.OrderByDescending(a => a.CreatedAt)
                : query.OrderBy(a => a.CreatedAt),
            _ => query.OrderByDescending(a => a.CreatedAt),
        };
    }
}
