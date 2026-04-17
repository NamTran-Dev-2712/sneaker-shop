using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetAvailableVouchersQueryHandler
    : IRequestHandler<GetAvailableVouchersQuery, List<GetAvailableVouchersResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAvailableVouchersQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<GetAvailableVouchersResult>> Handle(
        GetAvailableVouchersQuery query,
        CancellationToken cancellationToken
    )
    {
        var now = DateTime.UtcNow;

        // Load all active ONLINE/ALL vouchers that are within their time window
        var vouchers = await _unitOfWork
            .Vouchers.Query()
            .AsNoTracking()
            .Include(v => v.Redemptions)
            .Where(v =>
                v.IsActive
                && (v.Scope == VoucherScope.ONLINE || v.Scope == VoucherScope.ALL)
                && (v.StartsAt == null || v.StartsAt <= now)
                && (v.EndsAt == null || v.EndsAt >= now)
                && (v.MinOrderTotal == null || v.MinOrderTotal <= query.Subtotal)
            )
            .ToListAsync(cancellationToken);

        var result = new List<GetAvailableVouchersResult>();

        foreach (var voucher in vouchers)
        {
            // Skip if global usage limit is exhausted
            if (
                voucher.UsageLimit.HasValue
                && voucher.Redemptions.Count >= voucher.UsageLimit.Value
            )
                continue;

            // Skip if this customer already reached their per-customer limit
            if (voucher.UsagePerCustomer.HasValue)
            {
                var usedByCustomer = voucher.Redemptions.Count(r =>
                    r.CustomerId == query.CustomerId
                );
                if (usedByCustomer >= voucher.UsagePerCustomer.Value)
                    continue;
            }

            var discountAmount = voucher.CalculateDiscount(query.Subtotal);

            result.Add(
                new GetAvailableVouchersResult
                {
                    Code = voucher.Code,
                    DiscountType = voucher.DiscountType.ToString(),
                    DiscountValue = voucher.DiscountValue,
                    MaxDiscount = voucher.MaxDiscount,
                    MinOrderTotal = voucher.MinOrderTotal,
                    DiscountAmount = discountAmount,
                    EndsAt = voucher.EndsAt,
                }
            );
        }

        // Sort by discount amount descending so best deals appear first
        result.Sort((a, b) => b.DiscountAmount.CompareTo(a.DiscountAmount));

        return result;
    }
}
