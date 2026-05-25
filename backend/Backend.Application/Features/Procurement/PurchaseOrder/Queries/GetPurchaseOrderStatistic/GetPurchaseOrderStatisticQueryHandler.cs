using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetPurchaseOrderStatisticQueryHandler
    : IRequestHandler<GetPurchaseOrderStatisticQuery, GetPurchaseOrderStatisticResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetPurchaseOrderStatisticQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetPurchaseOrderStatisticResult> Handle(
        GetPurchaseOrderStatisticQuery query,
        CancellationToken cancellationToken
    )
    {
        var baseQuery = _unitOfWork.PurchaseOrders.Query().AsNoTracking();

        // Apply filters
        if (query.VendorId.HasValue)
        {
            baseQuery = baseQuery.Where(po => po.VendorId == query.VendorId);
        }

        if (query.StoreId.HasValue)
        {
            baseQuery = baseQuery.Where(po => po.StoreId == query.StoreId);
        }

        if (query.FromDate.HasValue)
        {
            baseQuery = baseQuery.Where(po => po.CreatedAt >= query.FromDate);
        }

        if (query.ToDate.HasValue)
        {
            baseQuery = baseQuery.Where(po => po.CreatedAt <= query.ToDate);
        }

        // Get statistics in a single query
        var stats = await baseQuery
            .GroupBy(_ => 1)
            .Select(g => new
            {
                TotalOrders = g.Count(),
                TotalCreated = g.Count(po => po.Status == PurchaseStatus.CREATED),
                TotalOrdered = g.Count(po => po.Status == PurchaseStatus.ORDERED),
                TotalReceived = g.Count(po => po.Status == PurchaseStatus.RECEIVED),
                TotalCancelled = g.Count(po => po.Status == PurchaseStatus.CANCELLED),
                TotalCost = g.Where(po => po.Status != PurchaseStatus.CANCELLED)
                    .SelectMany(po => po.Items)
                    .Sum(i => (decimal?)(i.Quantity * i.UnitCost))
                    ?? 0,
                TotalReceivedCost = g.Where(po => po.Status == PurchaseStatus.RECEIVED)
                    .SelectMany(po => po.Items)
                    .Sum(i => (decimal?)(i.Quantity * i.UnitCost))
                    ?? 0,
            })
            .FirstOrDefaultAsync(cancellationToken);

        return new GetPurchaseOrderStatisticResult
        {
            TotalOrders = stats?.TotalOrders ?? 0,
            TotalCreated = stats?.TotalCreated ?? 0,
            TotalOrdered = stats?.TotalOrdered ?? 0,
            TotalReceived = stats?.TotalReceived ?? 0,
            TotalCancelled = stats?.TotalCancelled ?? 0,
            TotalCost = stats?.TotalCost ?? 0,
            TotalReceivedCost = stats?.TotalReceivedCost ?? 0,
        };
    }
}
