using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetFinanceLedgerQueryHandler
    : IRequestHandler<GetFinanceLedgerQuery, BaseGetResponse<GetFinanceLedgerItemResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetFinanceLedgerQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetFinanceLedgerItemResult>> Handle(
        GetFinanceLedgerQuery query,
        CancellationToken cancellationToken
    )
    {
        if (query.PageSize > 100)
            query.PageSize = 100;

        var baseQuery = _unitOfWork.FinanceLedgerEntries.Query().AsNoTracking();

        if (query.StoreId.HasValue)
            baseQuery = baseQuery.Where(x => x.StoreId == query.StoreId);

        if (query.Status.HasValue)
            baseQuery = baseQuery.Where(x => x.Status == query.Status.Value);

        if (query.SourceType.HasValue)
            baseQuery = baseQuery.Where(x => x.SourceType == query.SourceType.Value);

        if (query.FromDate.HasValue)
        {
            var from = DateTime.SpecifyKind(query.FromDate.Value.Date, DateTimeKind.Utc);
            baseQuery = baseQuery.Where(x => x.OccurredAt >= from);
        }

        if (query.ToDate.HasValue)
        {
            var toExclusive = DateTime.SpecifyKind(
                query.ToDate.Value.Date.AddDays(1),
                DateTimeKind.Utc
            );
            baseQuery = baseQuery.Where(x => x.OccurredAt < toExclusive);
        }

        if (query.MinAmount.HasValue)
            baseQuery = baseQuery.Where(x => x.Amount >= query.MinAmount.Value);

        if (query.MaxAmount.HasValue)
            baseQuery = baseQuery.Where(x => x.Amount <= query.MaxAmount.Value);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var keyword = query.Search.Trim().ToLower();
            baseQuery = baseQuery.Where(x =>
                x.Category.ToLower().Contains(keyword)
                || (x.Description != null && x.Description.ToLower().Contains(keyword))
            );
        }

        baseQuery = (query.SortBy?.ToLower(), query.IsSortDescending) switch
        {
            ("amount", true) => baseQuery.OrderByDescending(x => x.Amount),
            ("amount", false) => baseQuery.OrderBy(x => x.Amount),
            ("createdat", true) => baseQuery.OrderByDescending(x => x.CreatedAt),
            ("createdat", false) => baseQuery.OrderBy(x => x.CreatedAt),
            ("occurredat", false) => baseQuery.OrderBy(x => x.OccurredAt),
            (_, true) => baseQuery.OrderByDescending(x => x.OccurredAt),
            _ => baseQuery.OrderBy(x => x.OccurredAt),
        };

        var totalItems = await baseQuery.CountAsync(cancellationToken);

        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(x => new GetFinanceLedgerItemResult
            {
                Id = x.Id,
                Status = x.Status,
                Amount = x.Amount,
                Category = x.Category,
                Description = x.Description,
                SourceType = x.SourceType,
                SourceId = x.SourceId,
                StoreId = x.StoreId,
                StoreName = x.Store != null ? x.Store.Name : null,
                OccurredAt = x.OccurredAt,
                CreatedAt = x.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        var totalPages =
            totalItems == 0 ? 0 : (int)Math.Ceiling((double)totalItems / query.PageSize);

        return new BaseGetResponse<GetFinanceLedgerItemResult>
        {
            Items = items,
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
        };
    }
}
