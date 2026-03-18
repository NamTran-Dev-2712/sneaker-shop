using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetStaffOrderDetailQueryHandler
    : IRequestHandler<GetStaffOrderDetailQuery, GetStaffOrderDetailResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetStaffOrderDetailQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetStaffOrderDetailResult> Handle(
        GetStaffOrderDetailQuery query,
        CancellationToken cancellationToken
    )
    {
        var order = await _unitOfWork
            .Orders.Query()
            .AsNoTracking()
            .Include(o => o.OrderItems)
            .Include(o => o.Payments)
            .Include(o => o.Store)
            .Include(o => o.Staff)
                .ThenInclude(s => s!.StaffProfile)
            .Include(o => o.Customer)
            .Include(o => o.OrderFulfillment)
                .ThenInclude(f => f!.PickupStore)
            .FirstOrDefaultAsync(o => o.Id == query.OrderId, cancellationToken);

        if (order == null)
        {
            throw new NotFoundException("Không tìm thấy đơn hàng.");
        }

        if (order.StoreId != query.StoreId)
        {
            throw new ForbiddenException("Bạn không có quyền xem đơn hàng này.");
        }

        var payment = order.Payments.OrderByDescending(x => x.UpdatedAt).FirstOrDefault();
        var fulfillment = order.OrderFulfillment;

        return new GetStaffOrderDetailResult
        {
            OrderId = order.Id,
            OrderCode = $"ORD-{order.Id:D6}",
            Status = order.Status.ToString(),
            Channel = order.Channel.ToString(),
            Note = order.Note,
            PlacedAt = order.PlacedAt,
            StoreId = order.StoreId,
            StoreName = order.Store?.Name,
            StaffId = order.StaffId,
            StaffName = order.Staff?.StaffProfile?.FullName,
            CustomerName = order.Customer?.FullName,
            CustomerPhone = order.Customer?.Phone,
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
                .OrderItems.Select(oi => new GetStaffOrderDetailItemResult
                {
                    SellableItemId = oi.SellableItemId,
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
