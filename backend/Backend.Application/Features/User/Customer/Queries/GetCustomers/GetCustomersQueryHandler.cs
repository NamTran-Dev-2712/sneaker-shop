using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetCustomersQueryHandler
    : IRequestHandler<GetCustomersQuery, BaseGetResponse<GetCustomersResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetCustomersQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetCustomersResult>> Handle(
        GetCustomersQuery query,
        CancellationToken cancellationToken
    )
    {
        var baseQuery = _unitOfWork
            .Customers.Query()
            .AsNoTracking()
            .Include(c => c.CustomerAccount)
                .ThenInclude(ca => ca != null ? ca.Account : null)
            .Where(c =>
                c.CustomerAccount == null || c.CustomerAccount.Account.Role == Role.CUSTOMER
            )
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLower();
            baseQuery = baseQuery.Where(c =>
                (c.FullName != null && c.FullName.ToLower().Contains(searchLower))
                || (c.Phone != null && c.Phone.Contains(searchLower))
                || (c.Email != null && c.Email.ToLower().Contains(searchLower))
            );
        }

        if (query.HasAccount.HasValue)
        {
            baseQuery = query.HasAccount.Value
                ? baseQuery.Where(c => c.CustomerAccount != null)
                : baseQuery.Where(c => c.CustomerAccount == null);
        }

        if (query.IsActive.HasValue)
        {
            baseQuery = baseQuery.Where(c =>
                c.CustomerAccount != null
                && c.CustomerAccount.Account.IsActive == query.IsActive.Value
            );
        }

        var totalItems = await baseQuery.CountAsync(cancellationToken);

        var isDescending = query.SortOrder.Equals(
            SortOrder.DESC,
            StringComparison.OrdinalIgnoreCase
        );
        baseQuery = query.SortBy.ToLower() switch
        {
            "name" => isDescending
                ? baseQuery.OrderByDescending(c => c.FullName)
                : baseQuery.OrderBy(c => c.FullName),
            _ => isDescending
                ? baseQuery.OrderByDescending(c => c.CreatedAt)
                : baseQuery.OrderBy(c => c.CreatedAt),
        };

        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(c => new GetCustomersResult
            {
                Id = c.Id,
                FullName = c.FullName ?? string.Empty,
                Phone = c.Phone,
                Email = c.Email,
                AccountId = c.CustomerAccount != null ? c.CustomerAccount.AccountId : null,
                HasAccount = c.CustomerAccount != null,
                IsActive = c.CustomerAccount != null && c.CustomerAccount.Account.IsActive,
                CreatedAt = c.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        var totalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize);

        return new BaseGetResponse<GetCustomersResult>
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
            Items = items,
        };
    }
}
