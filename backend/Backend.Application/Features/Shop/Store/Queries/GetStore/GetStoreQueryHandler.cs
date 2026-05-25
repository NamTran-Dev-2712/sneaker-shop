using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetStoreQueryHandler : IRequestHandler<GetStoreQuery, BaseGetResponse<GetStoreResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetStoreQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetStoreResult>> Handle(
        GetStoreQuery query,
        CancellationToken cancellationToken
    )
    {
        // 1. Build base query with AsNoTracking
        var baseQuery = _unitOfWork.Stores.Query().AsNoTracking().Where(s => !s.IsDeleted);

        // 2. Apply search filter (search in Name, Code, Address)
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLower();
            baseQuery = baseQuery.Where(s =>
                s.Name.ToLower().Contains(searchLower)
                || s.Code.ToLower().Contains(searchLower)
                || (s.Address != null && s.Address.ToLower().Contains(searchLower))
            );
        }

        // 3. Apply IsActive filter
        if (query.IsActive.HasValue)
        {
            baseQuery = baseQuery.Where(s => s.IsActive == query.IsActive.Value);
        }

        // 4. Get total count
        var totalItems = await baseQuery.CountAsync(cancellationToken);

        // 5. Apply sorting
        baseQuery = ApplySorting(baseQuery, query.SortBy, query.SortOrder);

        // 6. Apply pagination and projection
        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(s => new GetStoreResult
            {
                Id = s.Id,
                Code = s.Code,
                Name = s.Name,
                Address = s.Address,
                Phone = s.Phone,
                IsActive = s.IsActive,
                StaffCount = s.StaffProfiles.Count,
                CreatedAt = s.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        // 7. Calculate pagination info
        var totalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize);

        return new BaseGetResponse<GetStoreResult>
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
            Items = items,
        };
    }

    private static IQueryable<Store> ApplySorting(
        IQueryable<Store> query,
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
            "code" => isDescending
                ? query.OrderByDescending(s => s.Code)
                : query.OrderBy(s => s.Code),
            "createdat" => isDescending
                ? query.OrderByDescending(s => s.CreatedAt)
                : query.OrderBy(s => s.CreatedAt),
            _ => query.OrderBy(s => s.Name),
        };
    }
}
