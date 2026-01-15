using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetSneakerQueryHandler
    : IRequestHandler<GetSneakerQuery, BaseGetResponse<GetSneakerResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetSneakerQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetSneakerResult>> Handle(
        GetSneakerQuery query,
        CancellationToken cancellationToken
    )
    {
        // 1. Build base query with AsNoTracking
        var baseQuery = _unitOfWork.Sneakers.Query().AsNoTracking().Where(s => !s.IsDeleted);

        // 2. Apply search filter
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLower();
            baseQuery = baseQuery.Where(s =>
                s.Name.ToLower().Contains(searchLower) || s.Slug.ToLower().Contains(searchLower)
            );
        }

        // 3. Apply BrandId filter
        if (query.BrandId.HasValue)
        {
            baseQuery = baseQuery.Where(s => s.BrandId == query.BrandId.Value);
        }

        // 4. Apply BrandSeriesId filter
        if (query.BrandSeriesId.HasValue)
        {
            baseQuery = baseQuery.Where(s => s.BrandSeriesId == query.BrandSeriesId.Value);
        }

        // 5. Apply IsActive filter
        if (query.IsActive.HasValue)
        {
            baseQuery = baseQuery.Where(s => s.IsActive == query.IsActive.Value);
        }

        // 6. Apply price range filter
        if (query.MinPrice.HasValue)
        {
            baseQuery = baseQuery.Where(s => s.BasePrice >= query.MinPrice.Value);
        }

        if (query.MaxPrice.HasValue)
        {
            baseQuery = baseQuery.Where(s => s.BasePrice <= query.MaxPrice.Value);
        }

        // 7. Apply color filter (any match)
        if (query.ColorIds != null && query.ColorIds.Count > 0)
        {
            baseQuery = baseQuery.Where(s =>
                s.Colorways.Any(c => c.IsActive && query.ColorIds.Contains(c.ColorId))
            );
        }

        // 8. Apply size filter (any match)
        if (query.SizeIds != null && query.SizeIds.Count > 0)
        {
            baseQuery = baseQuery.Where(s => s.Variants.Any(v => query.SizeIds.Contains(v.SizeId)));
        }

        // 9. Get total count
        var totalItems = await baseQuery.CountAsync(cancellationToken);

        // 10. Apply sorting
        baseQuery = ApplySorting(baseQuery, query.SortBy, query.SortOrder);

        // 11. Apply pagination and projection
        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(s => new GetSneakerResult
            {
                Id = s.Id,
                Name = s.Name,
                Slug = s.Slug,
                MainImage = s.MainImage,
                BasePrice = s.BasePrice,
                IsActive = s.IsActive,
                Brand = new SneakerListBrandDto { Id = s.Brand.Id, Name = s.Brand.Name },
                BrandSeries =
                    s.BrandSeries != null
                        ? new SneakerListBrandSeriesDto
                        {
                            Id = s.BrandSeries.Id,
                            Name = s.BrandSeries.Name,
                        }
                        : null,
                ColorCount = s.Colorways.Count(c => c.IsActive),
                VariantCount = s.Variants.Count,
                CreatedAt = s.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        // 12. Calculate pagination info
        var totalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize);

        return new BaseGetResponse<GetSneakerResult>
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
            Items = items,
        };
    }

    private static IQueryable<Sneaker> ApplySorting(
        IQueryable<Sneaker> query,
        string sortBy,
        string sortOrder
    )
    {
        var isDescending = sortOrder.Equals(SortOrder.DESC, StringComparison.OrdinalIgnoreCase);

        return sortBy.ToLower() switch
        {
            "name" => isDescending
                ? query.OrderByDescending(s => s.Name)
                : query.OrderBy(s => s.Name),
            "price" => isDescending
                ? query.OrderByDescending(s => s.BasePrice)
                : query.OrderBy(s => s.BasePrice),
            "createdat" => isDescending
                ? query.OrderByDescending(s => s.CreatedAt)
                : query.OrderBy(s => s.CreatedAt),
            _ => query.OrderByDescending(s => s.CreatedAt),
        };
    }
}
