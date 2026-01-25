using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetPurchaseOrderQueryHandler
    : IRequestHandler<GetPurchaseOrderQuery, BaseGetResponse<GetPurchaseOrderResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetPurchaseOrderQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetPurchaseOrderResult>> Handle(
        GetPurchaseOrderQuery query,
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

        if (query.Status.HasValue)
        {
            baseQuery = baseQuery.Where(po => po.Status == query.Status);
        }

        if (query.FromDate.HasValue)
        {
            baseQuery = baseQuery.Where(po => po.CreatedAt >= query.FromDate);
        }

        if (query.ToDate.HasValue)
        {
            baseQuery = baseQuery.Where(po => po.CreatedAt <= query.ToDate);
        }

        // Search by vendor name, store name, or note
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchLower = query.Search.ToLower();
            baseQuery = baseQuery.Where(po =>
                po.Vendor.Name.ToLower().Contains(searchLower)
                || po.Store.Name.ToLower().Contains(searchLower)
                || (po.Note != null && po.Note.ToLower().Contains(searchLower))
            );
        }

        // Get total count
        var totalItems = await baseQuery.CountAsync(cancellationToken);

        // Apply sorting
        baseQuery = query.SortBy?.ToLower() switch
        {
            "vendor" => query.IsSortDescending
                ? baseQuery.OrderByDescending(po => po.Vendor.Name)
                : baseQuery.OrderBy(po => po.Vendor.Name),
            "store" => query.IsSortDescending
                ? baseQuery.OrderByDescending(po => po.Store.Name)
                : baseQuery.OrderBy(po => po.Store.Name),
            "status" => query.IsSortDescending
                ? baseQuery.OrderByDescending(po => po.Status)
                : baseQuery.OrderBy(po => po.Status),
            "totalcost" => query.IsSortDescending
                ? baseQuery.OrderByDescending(po => po.Items.Sum(i => i.Quantity * i.UnitCost))
                : baseQuery.OrderBy(po => po.Items.Sum(i => i.Quantity * i.UnitCost)),
            "expectedat" => query.IsSortDescending
                ? baseQuery.OrderByDescending(po => po.ExpectedAt)
                : baseQuery.OrderBy(po => po.ExpectedAt),
            _ => query.IsSortDescending
                ? baseQuery.OrderByDescending(po => po.CreatedAt)
                : baseQuery.OrderBy(po => po.CreatedAt),
        };

        // Apply pagination and projection
        var items = await baseQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(po => new GetPurchaseOrderResult
            {
                Id = po.Id,
                VendorId = po.VendorId,
                VendorName = po.Vendor.Name,
                StoreId = po.StoreId,
                StoreName = po.Store.Name,
                Status = po.Status,
                ExpectedAt = po.ExpectedAt,
                TotalCost = po.Items.Sum(i => i.Quantity * i.UnitCost),
                ItemCount = po.Items.Count,
                CreatedAt = po.CreatedAt,
                UpdatedAt = po.UpdatedAt,
            })
            .ToListAsync(cancellationToken);

        var totalPages = (int)Math.Ceiling((double)totalItems / query.PageSize);

        return new BaseGetResponse<GetPurchaseOrderResult>
        {
            Items = items,
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
        };
    }
}
