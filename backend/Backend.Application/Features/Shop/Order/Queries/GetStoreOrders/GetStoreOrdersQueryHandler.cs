using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetStoreOrdersQueryHandler
    : IRequestHandler<GetStoreOrdersQuery, BaseGetResponse<GetStoreOrdersResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetStoreOrdersQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseGetResponse<GetStoreOrdersResult>> Handle(
        GetStoreOrdersQuery query,
        CancellationToken cancellationToken
    )
    {
        if (query.PageSize > 50)
            query.PageSize = 50;

        var baseQuery = _unitOfWork
            .Orders.Query()
            .AsNoTracking()
            .Where(o => o.StoreId == query.StoreId);

        if (
            !string.IsNullOrWhiteSpace(query.Status)
            && Enum.TryParse<OrderStatus>(query.Status, true, out var parsedStatus)
        )
        {
            baseQuery = baseQuery.Where(o => o.Status == parsedStatus);
        }

        if (
            !string.IsNullOrWhiteSpace(query.PaymentStatus)
            && Enum.TryParse<PaymentStatus>(query.PaymentStatus, true, out var parsedPaymentStatus)
        )
        {
            baseQuery = baseQuery.Where(o => o.Payments.Any(p => p.Status == parsedPaymentStatus));
        }

        if (
            !string.IsNullOrWhiteSpace(query.FulfillmentType)
            && Enum.TryParse<FulfillmentType>(
                query.FulfillmentType,
                true,
                out var parsedFulfillmentType
            )
        )
        {
            baseQuery = baseQuery.Where(o =>
                o.OrderFulfillment != null && o.OrderFulfillment.Type == parsedFulfillmentType
            );
        }

        if (query.FromDate.HasValue)
        {
            var from = query.FromDate.Value.Date;
            baseQuery = baseQuery.Where(o => (o.PlacedAt ?? o.CreatedAt) >= from);
        }

        if (query.ToDate.HasValue)
        {
            var toExclusive = query.ToDate.Value.Date.AddDays(1);
            baseQuery = baseQuery.Where(o => (o.PlacedAt ?? o.CreatedAt) < toExclusive);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var keyword = query.Search.Trim();

            // Optimized search:
            // 1. If keyword is purely numeric — match order ID directly (uses PK index)
            // 2. If keyword starts with "ord-" — strip prefix and try numeric match
            // 3. Always also search customer name and phone (parameterized — safe)
            var numericKeyword = keyword;
            if (numericKeyword.StartsWith("ord-", StringComparison.OrdinalIgnoreCase))
                numericKeyword = numericKeyword[4..];

            var keywordLower = keyword.ToLower();

            if (int.TryParse(numericKeyword, out var numericId))
            {
                baseQuery = baseQuery.Where(o =>
                    o.Id == numericId
                    || (
                        o.Customer != null
                        && o.Customer.FullName != null
                        && o.Customer.FullName.ToLower().Contains(keywordLower)
                    )
                    || (
                        o.Customer != null
                        && o.Customer.Phone != null
                        && o.Customer.Phone.Contains(keyword)
                    )
                );
            }
            else
            {
                // Non-numeric search: customer name and phone only
                baseQuery = baseQuery.Where(o =>
                    (
                        o.Customer != null
                        && o.Customer.FullName != null
                        && o.Customer.FullName.ToLower().Contains(keywordLower)
                    )
                    || (
                        o.Customer != null
                        && o.Customer.Phone != null
                        && o.Customer.Phone.Contains(keyword)
                    )
                );
            }
        }

        var totalItems = await baseQuery.CountAsync(cancellationToken);

        var items = await baseQuery
            .OrderByDescending(o => o.PlacedAt ?? o.CreatedAt)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(o => new GetStoreOrdersResult
            {
                OrderId = o.Id,
                OrderCode = $"ORD-{o.Id:D6}",
                PlacedAt = o.PlacedAt,
                Status = o.Status.ToString(),
                PaymentStatus =
                    o.Payments.OrderByDescending(p => p.UpdatedAt)
                        .Select(p => p.Status.ToString())
                        .FirstOrDefault()
                    ?? "PENDING",
                PaymentMethod =
                    o.Payments.OrderByDescending(p => p.UpdatedAt)
                        .Select(p => p.Method.ToString())
                        .FirstOrDefault()
                    ?? "N/A",
                FulfillmentType =
                    o.OrderFulfillment != null ? o.OrderFulfillment.Type.ToString() : "N/A",
                CustomerName = o.Customer != null ? o.Customer.FullName : null,
                CustomerPhone = o.Customer != null ? o.Customer.Phone : null,
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

        var totalPages =
            totalItems == 0 ? 0 : (int)Math.Ceiling((double)totalItems / query.PageSize);

        return new BaseGetResponse<GetStoreOrdersResult>
        {
            Items = items,
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
        };
    }
}
