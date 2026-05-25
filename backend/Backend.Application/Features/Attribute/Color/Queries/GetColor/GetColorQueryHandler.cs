using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetColorQueryHandler : IRequestHandler<GetColorQuery, BaseGetResponse<GetColorResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetColorQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetColorResult>> Handle(
        GetColorQuery query,
        CancellationToken cancellationToken
    )
    {
        // 1. Build base query with AsNoTracking
        var baseQuery = _unitOfWork.Colors.Query().AsNoTracking();

        // 2. Apply search filter
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLower();
            baseQuery = baseQuery.Where(c =>
                c.Name.ToLower().Contains(searchLower) || c.Hex.ToLower().Contains(searchLower)
            );
        }

        // 3. Get total count before pagination
        var totalItems = await baseQuery.CountAsync(cancellationToken);

        // 4. Apply sorting
        baseQuery = ApplySorting(baseQuery, query.SortBy, query.SortOrder);

        // 5. Apply pagination and projection
        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(c => new GetColorResult
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Hex = c.Hex,
                ProductCount = c.SneakerColorways.Count,
                CreatedAt = c.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        // 6. Calculate pagination info
        var totalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize);

        return new BaseGetResponse<GetColorResult>
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
            Items = items,
        };
    }

    private static IQueryable<Color> ApplySorting(
        IQueryable<Color> query,
        string sortBy,
        string sortOrder
    )
    {
        var isDescending = sortOrder.Equals(SortOrder.DESC, StringComparison.OrdinalIgnoreCase);

        return sortBy.ToLower() switch
        {
            "name" => isDescending
                ? query.OrderByDescending(c => c.Name)
                : query.OrderBy(c => c.Name),
            "hex" => isDescending ? query.OrderByDescending(c => c.Hex) : query.OrderBy(c => c.Hex),
            "createdat" => isDescending
                ? query.OrderByDescending(c => c.CreatedAt)
                : query.OrderBy(c => c.CreatedAt),
            _ => query.OrderBy(c => c.Name),
        };
    }
}
