using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetOrderDetailQueryHandler : IRequestHandler<GetOrderDetailQuery, GetOrderDetailResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetOrderDetailQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetOrderDetailResult> Handle(
        GetOrderDetailQuery query,
        CancellationToken cancellationToken
    )
    {
        var order = await _unitOfWork
            .Orders.Query()
            .AsNoTracking()
            .Include(o => o.OrderItems)
            .Include(o => o.Payments)
            .Include(o => o.OrderFulfillment)
                .ThenInclude(f => f!.PickupStore)
            .FirstOrDefaultAsync(o => o.Id == query.OrderId, cancellationToken);

        if (order == null)
        {
            throw new NotFoundException("Không tìm thấy đơn hàng.");
        }

        // Security: verify the order belongs to the current customer
        if (order.CustomerId != query.CustomerId)
        {
            throw new ForbiddenException("Bạn không có quyền xem đơn hàng này.");
        }

        var payment = order.Payments.FirstOrDefault();
        var fulfillment = order.OrderFulfillment;

        return new GetOrderDetailResult
        {
            OrderId = order.Id,
            Status = order.Status.ToString(),
            Channel = order.Channel.ToString(),
            Note = order.Note,
            PlacedAt = order.PlacedAt,
            Subtotal = order.Subtotal,
            DiscountTotal = order.DiscountTotal,
            ShippingFee = order.ShippingFee,
            Total = order.Total,
            PaymentMethod = payment?.Method.ToString(),
            PaymentStatus = payment?.Status.ToString(),
            FulfillmentType = fulfillment?.Type.ToString(),
            RecipientName = fulfillment?.RecipientName,
            RecipientPhone = fulfillment?.RecipientPhone,
            Address = fulfillment?.Address,
            PickupStoreId = fulfillment?.PickupStoreId,
            PickupStoreName = fulfillment?.PickupStore?.Name,
            Carrier = fulfillment?.Carrier,
            TrackingCode = fulfillment?.TrackingCode,
            Items = order
                .OrderItems.Select(oi => new OrderDetailItemResult
                {
                    ProductName = oi.ProductNameSnapshot,
                    Sku = oi.SkuSnapshot,
                    VariantName = oi.VariantNameSnapshot,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPriceSnapshot,
                    Discount = oi.Discount,
                    LineTotal = oi.LineTotal,
                    ImageUrl = oi.PrimaryImageUrlSnapshot,
                })
                .ToList(),
        };
    }
}
