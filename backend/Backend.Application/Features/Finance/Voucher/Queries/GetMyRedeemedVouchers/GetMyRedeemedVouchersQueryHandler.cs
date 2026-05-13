using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetMyRedeemedVouchersQueryHandler
    : IRequestHandler<GetMyRedeemedVouchersQuery, BaseGetResponse<GetMyRedeemedVouchersResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetMyRedeemedVouchersQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetMyRedeemedVouchersResult>> Handle(
        GetMyRedeemedVouchersQuery query,
        CancellationToken cancellationToken
    )
    {
        var baseQuery = _unitOfWork
            .VoucherRedemptions.Query()
            .AsNoTracking()
            .Include(r => r.Voucher)
            .Include(r => r.Order)
            .Where(r => r.CustomerId == query.CustomerId)
            .OrderByDescending(r => r.RedeemedAt ?? r.CreatedAt);

        var totalItems = await baseQuery.CountAsync(cancellationToken);

        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(r => new GetMyRedeemedVouchersResult
            {
                Code = r.Voucher.Code,
                DiscountType = r.Voucher.DiscountType.ToString(),
                DiscountValue = r.Voucher.DiscountValue,
                DiscountAmount = r.DiscountAmount,
                OrderId = r.OrderId,
                OrderRef = r.Order.OrderRef ?? $"ORD-{r.OrderId:D6}",
                RedeemedAt = r.RedeemedAt,
            })
            .ToListAsync(cancellationToken);

        var totalPages = (int)Math.Ceiling((double)totalItems / query.PageSize);

        return new BaseGetResponse<GetMyRedeemedVouchersResult>
        {
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
            Items = items,
        };
    }
}
