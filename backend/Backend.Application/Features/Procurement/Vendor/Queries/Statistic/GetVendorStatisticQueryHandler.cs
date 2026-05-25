using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetVendorStatisticQuery : IRequest<GetVendorStatisticResult>;

public class GetVendorStatisticQueryHandler
    : IRequestHandler<GetVendorStatisticQuery, GetVendorStatisticResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetVendorStatisticQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetVendorStatisticResult> Handle(
        GetVendorStatisticQuery request,
        CancellationToken cancellationToken
    )
    {
        var vendorsQuery = _unitOfWork.Vendors.Query().AsNoTracking().Where(v => !v.IsDeleted);

        var totalVendors = await vendorsQuery.CountAsync(cancellationToken);
        var activeVendors = await vendorsQuery.CountAsync(v => v.IsActive, cancellationToken);

        var totalProductsSupplied = await _unitOfWork
            .VendorPrices.Query()
            .AsNoTracking()
            .Select(vp => vp.SellableItemId)
            .Distinct()
            .CountAsync(cancellationToken);

        var pendingPurchaseOrders = await _unitOfWork
            .PurchaseOrders.Query()
            .AsNoTracking()
            .CountAsync(
                po => po.Status == PurchaseStatus.CREATED || po.Status == PurchaseStatus.ORDERED,
                cancellationToken
            );

        return new GetVendorStatisticResult
        {
            TotalVendors = totalVendors,
            ActiveVendors = activeVendors,
            InactiveVendors = totalVendors - activeVendors,
            TotalProductsSupplied = totalProductsSupplied,
            PendingPurchaseOrders = pendingPurchaseOrders,
        };
    }
}
