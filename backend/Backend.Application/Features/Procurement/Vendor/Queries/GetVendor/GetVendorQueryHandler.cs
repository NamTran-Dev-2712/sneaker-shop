using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetVendorQueryHandler
    : IRequestHandler<GetVendorQuery, BaseGetResponse<GetVendorResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetVendorQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetVendorResult>> Handle(
        GetVendorQuery query,
        CancellationToken cancellationToken
    )
    {
        // 1. Build base query with AsNoTracking
        var baseQuery = _unitOfWork.Vendors.Query().AsNoTracking().Where(v => !v.IsDeleted);

        // 2. Apply search filter
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLower();
            baseQuery = baseQuery.Where(v =>
                v.Name.ToLower().Contains(searchLower)
                || v.Phone.Contains(searchLower)
                || v.Email.ToLower().Contains(searchLower)
            );
        }

        // 3. Apply IsActive filter
        if (query.IsActive.HasValue)
        {
            baseQuery = baseQuery.Where(v => v.IsActive == query.IsActive.Value);
        }

        // 4. Get total count
        var totalItems = await baseQuery.CountAsync(cancellationToken);

        // 5. Apply sorting
        baseQuery = ApplySorting(baseQuery, query.SortBy, query.SortOrder);

        // 6. Apply pagination and projection
        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(v => new GetVendorResult
            {
                Id = v.Id,
                Name = v.Name,
                Phone = v.Phone,
                Email = v.Email,
                Address = v.Address,
                IsActive = v.IsActive,
                ProductCount = v.VendorPrices.Select(vp => vp.SellableItemId).Distinct().Count(),
                CreatedAt = v.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        // 7. Calculate pagination info
        var totalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize);

        return new BaseGetResponse<GetVendorResult>
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
            Items = items,
        };
    }

    private static IQueryable<Vendor> ApplySorting(
        IQueryable<Vendor> query,
        string sortBy,
        string sortOrder
    )
    {
        var isDescending = sortOrder.Equals(SortOrder.DESC, StringComparison.OrdinalIgnoreCase);

        return sortBy.ToLower() switch
        {
            "name" => isDescending
                ? query.OrderByDescending(v => v.Name)
                : query.OrderBy(v => v.Name),
            "createdat" => isDescending
                ? query.OrderByDescending(v => v.CreatedAt)
                : query.OrderBy(v => v.CreatedAt),
            "email" => isDescending
                ? query.OrderByDescending(v => v.Email)
                : query.OrderBy(v => v.Email),
            _ => query.OrderBy(v => v.Name),
        };
    }
}
