using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetFinanceSummaryQueryHandler
    : IRequestHandler<GetFinanceSummaryQuery, GetFinanceSummaryResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetFinanceSummaryQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetFinanceSummaryResult> Handle(
        GetFinanceSummaryQuery query,
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

        var totalIncome = await baseQuery
            .Where(x => x.Status == FinanceEntryStatus.INCOME)
            .SumAsync(x => (decimal?)x.Amount, cancellationToken);

        var totalExpense = await baseQuery
            .Where(x => x.Status == FinanceEntryStatus.EXPENSE)
            .SumAsync(x => (decimal?)x.Amount, cancellationToken);

        var totalTransactions = await baseQuery.CountAsync(cancellationToken);

        var incomeValue = totalIncome ?? 0;
        var expenseValue = totalExpense ?? 0;

        return new GetFinanceSummaryResult
        {
            TotalIncome = incomeValue,
            TotalExpense = expenseValue,
            Profit = incomeValue - expenseValue,
            TotalTransactions = totalTransactions,
            RangeStart = start,
            RangeEnd = endExclusive.AddTicks(-1),
        };
    }
}
