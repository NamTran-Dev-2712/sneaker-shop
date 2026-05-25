using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetSizeQueryHandler : IRequestHandler<GetSizeQuery, BaseGetResponse<GetSizeResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetSizeQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetSizeResult>> Handle(
        GetSizeQuery query,
        CancellationToken cancellationToken
    )
    {
        // 1. Build base query with AsNoTracking
        var baseQuery = _unitOfWork.Sizes.Query().AsNoTracking();

        // 2. Apply search filter
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLower();
            baseQuery = baseQuery.Where(s =>
                s.System.ToLower().Contains(searchLower) || s.Value.ToString().Contains(searchLower)
            );
        }

        // 3. Apply system filter
        if (!string.IsNullOrWhiteSpace(query.System))
        {
            var systemUpper = query.System.ToUpper();
            baseQuery = baseQuery.Where(s => s.System == systemUpper);
        }

        // 4. Get total count
        var totalItems = await baseQuery.CountAsync(cancellationToken);

        // 5. Apply sorting
        baseQuery = ApplySorting(baseQuery, query.SortBy, query.SortOrder);

        // 6. Apply pagination and projection
        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(s => new GetSizeResult
            {
                Id = s.Id,
                System = s.System,
                Value = s.Value,
                ProductCount = s.SneakerVariants.Count,
                CreatedAt = s.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        // 7. Calculate pagination info
        var totalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize);

        return new BaseGetResponse<GetSizeResult>
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
            Items = items,
        };
    }

    private static IQueryable<Size> ApplySorting(
        IQueryable<Size> query,
        string sortBy,
        string sortOrder
    )
    {
        var isDescending = sortOrder.Equals(SortOrder.DESC, StringComparison.OrdinalIgnoreCase);

        return sortBy.ToLower() switch
        {
            "value" => isDescending
                ? query.OrderByDescending(s => s.Value)
                : query.OrderBy(s => s.Value),
            "system" => isDescending
                ? query.OrderByDescending(s => s.System).ThenBy(s => s.Value)
                : query.OrderBy(s => s.System).ThenBy(s => s.Value),
            "createdat" => isDescending
                ? query.OrderByDescending(s => s.CreatedAt)
                : query.OrderBy(s => s.CreatedAt),
            _ => query.OrderBy(s => s.System).ThenBy(s => s.Value),
        };
    }
}
