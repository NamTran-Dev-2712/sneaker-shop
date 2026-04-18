using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetMyAvailableVouchersQueryHandler
    : IRequestHandler<GetMyAvailableVouchersQuery, List<GetMyAvailableVouchersResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetMyAvailableVouchersQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<GetMyAvailableVouchersResult>> Handle(
        GetMyAvailableVouchersQuery query,
        CancellationToken cancellationToken
    )
    {
        var now = DateTime.UtcNow;

        var vouchers = await _unitOfWork
            .Vouchers.Query()
            .AsNoTracking()
            .Include(v => v.Redemptions)
            .Where(v =>
                v.IsActive
                && (v.Scope == VoucherScope.ONLINE || v.Scope == VoucherScope.ALL)
                && (v.StartsAt == null || v.StartsAt <= now)
                && (v.EndsAt == null || v.EndsAt >= now)
            )
            .ToListAsync(cancellationToken);

        var result = new List<GetMyAvailableVouchersResult>();

        foreach (var voucher in vouchers)
        {
            // Skip if global usage limit exhausted
            if (
                voucher.UsageLimit.HasValue
                && voucher.Redemptions.Count >= voucher.UsageLimit.Value
            )
                continue;

            // Skip if customer already reached per-customer limit
            if (voucher.UsagePerCustomer.HasValue)
            {
                var usedByCustomer = voucher.Redemptions.Count(r =>
                    r.CustomerId == query.CustomerId
                );
                if (usedByCustomer >= voucher.UsagePerCustomer.Value)
                    continue;
            }

            result.Add(
                new GetMyAvailableVouchersResult
                {
                    Code = voucher.Code,
                    DiscountType = voucher.DiscountType.ToString(),
                    DiscountValue = voucher.DiscountValue,
                    MaxDiscount = voucher.MaxDiscount,
                    MinOrderTotal = voucher.MinOrderTotal,
                    Scope = voucher.Scope.ToString(),
                    StartsAt = voucher.StartsAt,
                    EndsAt = voucher.EndsAt,
                }
            );
        }

        return result;
    }
}
