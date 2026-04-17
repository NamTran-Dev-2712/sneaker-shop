using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetMyLoyaltyAccountQueryHandler
    : IRequestHandler<GetMyLoyaltyAccountQuery, GetMyLoyaltyAccountResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetMyLoyaltyAccountQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetMyLoyaltyAccountResult> Handle(
        GetMyLoyaltyAccountQuery query,
        CancellationToken cancellationToken
    )
    {
        var account = await _unitOfWork
            .LoyaltyAccounts.Query()
            .AsNoTracking()
            .FirstOrDefaultAsync(la => la.CustomerId == query.CustomerId, cancellationToken);

        // Return zero-balance if account not yet created (no orders delivered yet)
        return new GetMyLoyaltyAccountResult
        {
            PointsBalance = account?.PointsBalance ?? 0,
            Tier = account?.Tier ?? "STANDARD",
        };
    }
}
