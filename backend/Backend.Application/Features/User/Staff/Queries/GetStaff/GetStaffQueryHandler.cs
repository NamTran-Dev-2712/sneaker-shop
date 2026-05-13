using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetStaffQueryHandler : IRequestHandler<GetStaffQuery, BaseGetResponse<GetStaffResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetStaffQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetStaffResult>> Handle(
        GetStaffQuery query,
        CancellationToken cancellationToken
    )
    {
        // 1. Build base query
        var baseQuery = _unitOfWork
            .Staffs.Query()
            .AsNoTracking()
            .Include(s => s.Account)
            .Include(s => s.Store)
            .AsQueryable();

        // 2. Apply search filter
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLower();
            baseQuery = baseQuery.Where(s =>
                (s.FullName != null && s.FullName.ToLower().Contains(searchLower))
                || s.Account.Email.ToLower().Contains(searchLower)
                || s.Account.Phone.ToLower().Contains(searchLower)
                || s.Store.Name.ToLower().Contains(searchLower)
            );
        }

        // 3. Apply StoreId filter
        if (query.StoreId.HasValue)
        {
            baseQuery = baseQuery.Where(s => s.StoreId == query.StoreId.Value);
        }

        // 4. Apply IsActive filter
        if (query.IsActive.HasValue)
        {
            baseQuery = baseQuery.Where(s => s.Account.IsActive == query.IsActive.Value);
        }

        // 5. Get total count
        var totalItems = await baseQuery.CountAsync(cancellationToken);

        // 6. Apply sorting
        baseQuery = ApplySorting(baseQuery, query.SortBy, query.SortOrder);

        // 7. Apply pagination and projection
        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(s => new GetStaffResult
            {
                Id = s.Id,
                AccountId = s.AccountId,
                FullName = s.FullName ?? string.Empty,
                Email = s.Account.Email,
                Phone = s.Account.Phone,
                StoreId = s.StoreId,
                StoreName = s.Store.Name,
                StoreCode = s.Store.Code,
                IsActive = s.Account.IsActive,
                CreatedAt = s.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        // 8. Calculate pagination info
        var totalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize);

        return new BaseGetResponse<GetStaffResult>
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
            Items = items,
        };
    }

    private static IQueryable<StaffProfile> ApplySorting(
        IQueryable<StaffProfile> query,
        string sortBy,
        string sortOrder
    )
    {
        var isDescending = sortOrder.Equals(SortOrder.DESC, StringComparison.OrdinalIgnoreCase);

        return sortBy.ToLower() switch
        {
            "name" => isDescending
                ? query.OrderByDescending(s => s.FullName)
                : query.OrderBy(s => s.FullName),
            "email" => isDescending
                ? query.OrderByDescending(s => s.Account.Email)
                : query.OrderBy(s => s.Account.Email),
            "store" => isDescending
                ? query.OrderByDescending(s => s.Store.Name)
                : query.OrderBy(s => s.Store.Name),
            "createdat" => isDescending
                ? query.OrderByDescending(s => s.CreatedAt)
                : query.OrderBy(s => s.CreatedAt),
            _ => query.OrderBy(s => s.FullName),
        };
    }
}
