using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetVoucherQueryHandler
    : IRequestHandler<GetVoucherQuery, BaseGetResponse<GetVoucherResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetVoucherQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetVoucherResult>> Handle(
        GetVoucherQuery query,
        CancellationToken cancellationToken
    )
    {
        var now = DateTime.UtcNow;

        IQueryable<Voucher> baseQuery = _unitOfWork
            .Vouchers.Query()
            .AsNoTracking()
            .Include(v => v.Redemptions);

        // Search by code
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var keyword = query.Search.Trim().ToUpper();
            baseQuery = baseQuery.Where(v => v.Code.ToUpper().Contains(keyword));
        }

        // Filter by scope
        if (query.Scope.HasValue)
            baseQuery = baseQuery.Where(v => v.Scope == query.Scope.Value);

        // Filter by discount type
        if (query.DiscountType.HasValue)
            baseQuery = baseQuery.Where(v => v.DiscountType == query.DiscountType.Value);

        // Filter by computed status
        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            baseQuery = query.Status.ToUpper() switch
            {
                VoucherStatus.ACTIVE => baseQuery.Where(v =>
                    v.IsActive
                    && (v.StartsAt == null || v.StartsAt <= now)
                    && (v.EndsAt == null || v.EndsAt >= now)
                    && (v.UsageLimit == null || v.Redemptions.Count < v.UsageLimit)
                ),
                VoucherStatus.SCHEDULED => baseQuery.Where(v =>
                    v.IsActive && v.StartsAt != null && v.StartsAt > now
                ),
                VoucherStatus.EXPIRED => baseQuery.Where(v =>
                    v.IsActive && v.EndsAt != null && v.EndsAt < now
                ),
                VoucherStatus.EXHAUSTED => baseQuery.Where(v =>
                    v.IsActive
                    && v.UsageLimit != null
                    && v.Redemptions.Count >= v.UsageLimit
                    && (v.EndsAt == null || v.EndsAt >= now)
                ),
                VoucherStatus.INACTIVE => baseQuery.Where(v => !v.IsActive),
                _ => baseQuery,
            };
        }

        var totalItems = await baseQuery.CountAsync(cancellationToken);

        baseQuery = (query.SortBy?.ToLower(), query.SortOrder?.ToLower()) switch
        {
            ("code", "asc") => baseQuery.OrderBy(v => v.Code),
            ("code", "desc") => baseQuery.OrderByDescending(v => v.Code),
            ("discountvalue", "asc") => baseQuery.OrderBy(v => v.DiscountValue),
            ("discountvalue", "desc") => baseQuery.OrderByDescending(v => v.DiscountValue),
            ("createdat", "asc") => baseQuery.OrderBy(v => v.CreatedAt),
            (_, "asc") => baseQuery.OrderBy(v => v.CreatedAt),
            _ => baseQuery.OrderByDescending(v => v.CreatedAt),
        };

        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(v => new
            {
                v.Id,
                v.Code,
                v.DiscountType,
                v.DiscountValue,
                v.MaxDiscount,
                v.MinOrderTotal,
                v.Scope,
                v.UsageLimit,
                v.UsagePerCustomer,
                UsageCount = v.Redemptions.Count,
                v.StartsAt,
                v.EndsAt,
                v.IsActive,
                v.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        var results = items
            .Select(v => new GetVoucherResult
            {
                Id = v.Id,
                Code = v.Code,
                DiscountType = v.DiscountType.ToString(),
                DiscountValue = v.DiscountValue,
                MaxDiscount = v.MaxDiscount,
                MinOrderTotal = v.MinOrderTotal,
                Scope = v.Scope.ToString(),
                UsageLimit = v.UsageLimit,
                UsagePerCustomer = v.UsagePerCustomer,
                UsageCount = v.UsageCount,
                StartsAt = v.StartsAt,
                EndsAt = v.EndsAt,
                IsActive = v.IsActive,
                ComputedStatus = ComputeStatus(
                    v.IsActive,
                    v.StartsAt,
                    v.EndsAt,
                    v.UsageLimit,
                    v.UsageCount,
                    now
                ),
                CreatedAt = v.CreatedAt,
            })
            .ToList();

        var totalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize);

        return new BaseGetResponse<GetVoucherResult>
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
            Items = results,
        };
    }

    internal static string ComputeStatus(
        bool isActive,
        DateTime? startsAt,
        DateTime? endsAt,
        int? usageLimit,
        int usageCount,
        DateTime now
    )
    {
        if (!isActive)
            return VoucherStatus.INACTIVE;
        if (startsAt.HasValue && startsAt.Value > now)
            return VoucherStatus.SCHEDULED;
        if (endsAt.HasValue && endsAt.Value < now)
            return VoucherStatus.EXPIRED;
        if (usageLimit.HasValue && usageCount >= usageLimit.Value)
            return VoucherStatus.EXHAUSTED;
        return VoucherStatus.ACTIVE;
    }
}
