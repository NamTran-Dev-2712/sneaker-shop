using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetAllPurchaseOrderQueryHandler
    : IRequestHandler<GetAllPurchaseOrderQuery, List<GetAllPurchaseOrderResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAllPurchaseOrderQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<GetAllPurchaseOrderResult>> Handle(
        GetAllPurchaseOrderQuery query,
        CancellationToken cancellationToken
    )
    {
        var baseQuery = _unitOfWork.PurchaseOrders.Query().AsNoTracking();

        if (query.Status.HasValue)
        {
            baseQuery = baseQuery.Where(po => po.Status == query.Status);
        }

        if (query.VendorId.HasValue)
        {
            baseQuery = baseQuery.Where(po => po.VendorId == query.VendorId);
        }

        if (query.StoreId.HasValue)
        {
            baseQuery = baseQuery.Where(po => po.StoreId == query.StoreId);
        }

        return await baseQuery
            .OrderByDescending(po => po.CreatedAt)
            .Select(po => new GetAllPurchaseOrderResult
            {
                Id = po.Id,
                VendorName = po.Vendor.Name,
                StoreName = po.Store.Name,
                Status = po.Status,
                TotalCost = po.Items.Sum(i => i.Quantity * i.UnitCost),
                ItemCount = po.Items.Count,
                CreatedAt = po.CreatedAt,
            })
            .ToListAsync(cancellationToken);
    }
}
