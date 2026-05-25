using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetCategoryAccessoryQueryHandler
    : IRequestHandler<GetCategoryAccessoryQuery, BaseGetResponse<GetCategoryAccessoryResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetCategoryAccessoryQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetCategoryAccessoryResult>> Handle(
        GetCategoryAccessoryQuery query,
        CancellationToken cancellationToken
    )
    {
        // 1. Build base query with AsNoTracking
        var baseQuery = _unitOfWork
            .CategoryAccessories.Query()
            .AsNoTracking()
            .Where(c => !c.IsDeleted);

        // 2. Apply search filter
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLower();
            baseQuery = baseQuery.Where(c =>
                c.Name.ToLower().Contains(searchLower) || c.Slug.ToLower().Contains(searchLower)
            );
        }

        // 3. Get total count
        var totalItems = await baseQuery.CountAsync(cancellationToken);

        // 4. Apply sorting
        baseQuery = ApplySorting(baseQuery, query.SortBy, query.SortOrder);

        // 5. Apply pagination and projection
        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(c => new GetCategoryAccessoryResult
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Brands = c
                    .Brands.Where(b => !b.IsDeleted)
                    .OrderBy(b => b.Name)
                    .Select(b => new BrandSummaryDto
                    {
                        Id = b.Id,
                        Name = b.Name,
                        Slug = b.Slug,
                        ThumbnailUrl = b.ThumbnailUrl,
                    })
                    .ToList(),
                BrandCount = c.Brands.Count(b => !b.IsDeleted),
                AccessoryCount = c.Accessories.Count(a => !a.IsDeleted),
                CreatedAt = c.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        // 6. Calculate pagination info
        var totalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize);

        return new BaseGetResponse<GetCategoryAccessoryResult>
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
            Items = items,
        };
    }

    private static IQueryable<CategoryAccessory> ApplySorting(
        IQueryable<CategoryAccessory> query,
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
                ? query.OrderByDescending(c => c.Name)
                : query.OrderBy(c => c.Name),
            "createdat" => isDescending
                ? query.OrderByDescending(c => c.CreatedAt)
                : query.OrderBy(c => c.CreatedAt),
            _ => query.OrderBy(c => c.Name),
        };
    }
}
