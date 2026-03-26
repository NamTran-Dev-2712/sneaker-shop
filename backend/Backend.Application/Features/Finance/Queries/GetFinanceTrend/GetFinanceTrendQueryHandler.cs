using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetFinanceTrendQueryHandler
    : IRequestHandler<GetFinanceTrendQuery, List<FinanceTrendPointResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetFinanceTrendQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<FinanceTrendPointResult>> Handle(
        GetFinanceTrendQuery query,
        CancellationToken cancellationToken
    )
    {
        var now = DateTime.UtcNow;
        var start = query.FromDate.HasValue
            ? DateTime.SpecifyKind(query.FromDate.Value.Date, DateTimeKind.Utc)
            : new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

        var endExclusive = (
            query.ToDate.HasValue
                ? DateTime.SpecifyKind(query.ToDate.Value.Date, DateTimeKind.Utc)
                : start.AddMonths(1).AddDays(-1)
        ).AddDays(1);

        var baseQuery = _unitOfWork
            .FinanceLedgerEntries.Query()
            .AsNoTracking()
            .Where(x => x.OccurredAt >= start && x.OccurredAt < endExclusive);

        if (query.StoreId.HasValue)
        {
            baseQuery = baseQuery.Where(x => x.StoreId == query.StoreId);
        }

        var grouped = await baseQuery
            .GroupBy(x => x.OccurredAt.Date)
            .Select(g => new FinanceTrendPointResult
            {
                Date = g.Key,
                Income =
                    g.Where(x => x.Status == FinanceEntryStatus.INCOME).Sum(x => (decimal?)x.Amount)
                    ?? 0,
                Expense =
                    g.Where(x => x.Status == FinanceEntryStatus.EXPENSE)
                        .Sum(x => (decimal?)x.Amount)
                    ?? 0,
                Profit = 0,
            })
            .OrderBy(x => x.Date)
            .ToListAsync(cancellationToken);

        return grouped.Select(x => x with { Profit = x.Income - x.Expense }).ToList();
    }
}
