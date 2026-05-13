using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetMyOrdersQueryHandler
    : IRequestHandler<GetMyOrdersQuery, BaseGetResponse<GetMyOrdersResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetMyOrdersQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetMyOrdersResult>> Handle(
        GetMyOrdersQuery query,
        CancellationToken cancellationToken
    )
    {
        // Cap pageSize to prevent abuse
        if (query.PageSize > 50)
            query.PageSize = 50;

        var baseQuery = _unitOfWork
            .Orders.Query()
            .AsNoTracking()
            .Where(o => o.CustomerId == query.CustomerId);

        // Filter by status if provided
        if (
            !string.IsNullOrWhiteSpace(query.Status)
            && Enum.TryParse<OrderStatus>(query.Status, ignoreCase: true, out var parsedStatus)
        )
        {
            baseQuery = baseQuery.Where(o => o.Status == parsedStatus);
        }

        // Total count
        var totalItems = await baseQuery.CountAsync(cancellationToken);

        // Sort by PlacedAt descending (newest first)
        var sortedQuery = baseQuery.OrderByDescending(o => o.PlacedAt ?? o.CreatedAt);

        // Pagination + projection
        var items = await sortedQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(o => new GetMyOrdersResult
            {
                OrderId = o.Id,
                PlacedAt = o.PlacedAt,
                Status = o.Status.ToString(),
                PaymentMethod = o.Payments.Any() ? o.Payments.First().Method.ToString() : "N/A",
                FulfillmentType =
                    o.OrderFulfillment != null ? o.OrderFulfillment.Type.ToString() : "N/A",
                Subtotal = o.Subtotal,
                ShippingFee = o.ShippingFee,
                DiscountTotal = o.DiscountTotal,
                Total = o.Total,
                ItemCount = o.OrderItems.Count,
                FirstItemName = o
                    .OrderItems.OrderBy(oi => oi.Id)
                    .Select(oi => oi.ProductNameSnapshot)
                    .FirstOrDefault(),
                FirstItemImage = o
                    .OrderItems.OrderBy(oi => oi.Id)
                    .Select(oi => oi.PrimaryImageUrlSnapshot)
                    .FirstOrDefault(),
            })
            .ToListAsync(cancellationToken);

        var totalPages = (int)Math.Ceiling((double)totalItems / query.PageSize);

        return new BaseGetResponse<GetMyOrdersResult>
        {
            Items = items,
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
        };
    }
}
