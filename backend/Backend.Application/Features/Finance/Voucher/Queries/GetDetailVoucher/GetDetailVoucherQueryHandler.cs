using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetDetailVoucherQueryHandler
    : IRequestHandler<GetDetailVoucherQuery, GetDetailVoucherResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetDetailVoucherQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetDetailVoucherResult> Handle(
        GetDetailVoucherQuery query,
        CancellationToken cancellationToken
    )
    {
        var now = DateTime.UtcNow;

        var voucher = await _unitOfWork
            .Vouchers.Query()
            .AsNoTracking()
            .Where(v => v.Id == query.Id)
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
                v.StartsAt,
                v.EndsAt,
                v.IsActive,
                v.CreatedAt,
                v.UpdatedAt,
                TotalRedemptions = v.Redemptions.Count,
                UniqueCustomers = v.Redemptions.Select(r => r.CustomerId).Distinct().Count(),
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (voucher == null)
            throw new NotFoundException("Không tìm thấy voucher.");

        var computedStatus = GetVoucherQueryHandler.ComputeStatus(
            voucher.IsActive,
            voucher.StartsAt,
            voucher.EndsAt,
            voucher.UsageLimit,
            voucher.TotalRedemptions,
            now
        );

        return new GetDetailVoucherResult
        {
            Id = voucher.Id,
            Code = voucher.Code,
            DiscountType = voucher.DiscountType.ToString(),
            DiscountValue = voucher.DiscountValue,
            MaxDiscount = voucher.MaxDiscount,
            MinOrderTotal = voucher.MinOrderTotal,
            Scope = voucher.Scope.ToString(),
            UsageLimit = voucher.UsageLimit,
            UsagePerCustomer = voucher.UsagePerCustomer,
            TotalRedemptions = voucher.TotalRedemptions,
            UniqueCustomers = voucher.UniqueCustomers,
            RemainingUsage = voucher.UsageLimit.HasValue
                ? Math.Max(0, voucher.UsageLimit.Value - voucher.TotalRedemptions)
                : null,
            StartsAt = voucher.StartsAt,
            EndsAt = voucher.EndsAt,
            IsActive = voucher.IsActive,
            ComputedStatus = computedStatus,
            CreatedAt = voucher.CreatedAt,
            UpdatedAt = voucher.UpdatedAt,
        };
    }
}
