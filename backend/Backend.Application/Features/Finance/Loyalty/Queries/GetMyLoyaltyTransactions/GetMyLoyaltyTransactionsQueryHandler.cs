using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetMyLoyaltyTransactionsQueryHandler
    : IRequestHandler<
        GetMyLoyaltyTransactionsQuery,
        BaseGetResponse<GetMyLoyaltyTransactionsResult>
    >
{
    private readonly IUnitOfWork _unitOfWork;

    public GetMyLoyaltyTransactionsQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetMyLoyaltyTransactionsResult>> Handle(
        GetMyLoyaltyTransactionsQuery query,
        CancellationToken cancellationToken
    )
    {
        // Find the loyalty account for this customer
        var account = await _unitOfWork
            .LoyaltyAccounts.Query()
            .AsNoTracking()
            .FirstOrDefaultAsync(la => la.CustomerId == query.CustomerId, cancellationToken);

        if (account == null)
        {
            return new BaseGetResponse<GetMyLoyaltyTransactionsResult>
            {
                TotalItems = 0,
                TotalPages = 0,
                HasPreviousPage = false,
                HasNextPage = false,
                Items = new List<GetMyLoyaltyTransactionsResult>(),
            };
        }

        var baseQuery = _unitOfWork
            .LoyaltyTransactions.Query()
            .AsNoTracking()
            .Where(lt => lt.LoyaltyAccountId == account.Id)
            .OrderByDescending(lt => lt.CreatedAt);

        var totalItems = await baseQuery.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling((double)totalItems / query.PageSize);

        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(lt => new GetMyLoyaltyTransactionsResult
            {
                Id = lt.Id,
                TxnType = lt.TxnType.ToString(),
                Points = lt.Points,
                Reason = lt.Reason,
                OrderId = lt.OrderId,
                CreatedAt = lt.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return new BaseGetResponse<GetMyLoyaltyTransactionsResult>
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
            Items = items,
        };
    }
}
