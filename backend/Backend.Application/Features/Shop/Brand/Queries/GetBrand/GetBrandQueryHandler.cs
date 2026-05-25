using System.Linq.Expressions;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetBrandQueryHandler : IRequestHandler<GetBrandQuery, BaseGetResponse<GetBrandResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetBrandQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetBrandResult>> Handle(
        GetBrandQuery query,
        CancellationToken cancellationToken
    )
    {
        // 1. Build base query with AsNoTracking for read-only
        var baseQuery = _unitOfWork.Brands.Query().AsNoTracking().Where(b => !b.IsDeleted);

        // 2. Apply search filter
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLower();
            baseQuery = baseQuery.Where(b => b.Name.ToLower().Contains(searchLower));
        }

        // 3. Apply IsActive filter
        if (query.IsActive.HasValue)
        {
            baseQuery = baseQuery.Where(b => b.IsActive == query.IsActive.Value);
        }

        // 4. Get total count before pagination
        var totalItems = await baseQuery.CountAsync(cancellationToken);

        // 5. Apply sorting
        baseQuery = ApplySorting(baseQuery, query.SortBy, query.SortOrder);

        // 6. Apply pagination and projection
        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(b => new GetBrandResult
            {
                Id = b.Id,
                Name = b.Name,
                Slug = b.Slug,
                LogoUrl = b.LogoUrl,
                IsActive = b.IsActive,
                SeriesCount = b.BrandSeries.Count(s => !s.IsDeleted),
                Series = b
                    .BrandSeries.Where(s => !s.IsDeleted)
                    .Select(s => new BrandSeriesDto
                    {
                        Id = s.Id,
                        Name = s.Name,
                        Slug = s.Slug,
                        IsActive = s.IsActive,
                        SneakerCount = s.Sneakers.Count(sn => !sn.IsDeleted),
                    })
                    .ToList(),
                CreatedAt = b.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        // 7. Calculate pagination info
        var totalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize);

        return new BaseGetResponse<GetBrandResult>
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
            Items = items,
        };
    }

    private static IQueryable<Brand> ApplySorting(
        IQueryable<Brand> query,
        string sortBy,
        string sortOrder
    )
    {
        var isDescending = sortOrder.Equals(SortOrder.DESC, StringComparison.OrdinalIgnoreCase);

        return sortBy.ToLower() switch
        {
            "name" => isDescending
                ? query.OrderByDescending(b => b.Name)
                : query.OrderBy(b => b.Name),
            "createdat" => isDescending
                ? query.OrderByDescending(b => b.CreatedAt)
                : query.OrderBy(b => b.CreatedAt),
            "updatedat" => isDescending
                ? query.OrderByDescending(b => b.UpdatedAt)
                : query.OrderBy(b => b.UpdatedAt),
            _ => query.OrderBy(b => b.Name),
        };
    }
}
