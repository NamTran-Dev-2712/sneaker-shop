using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetDetailPurchaseOrderQueryHandler
    : IRequestHandler<GetDetailPurchaseOrderQuery, GetDetailPurchaseOrderResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetDetailPurchaseOrderQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetDetailPurchaseOrderResult> Handle(
        GetDetailPurchaseOrderQuery query,
        CancellationToken cancellationToken
    )
    {
        var purchaseOrder = await _unitOfWork
            .PurchaseOrders.Query()
            .AsNoTracking()
            .Where(po => po.Id == query.Id)
            .Select(po => new GetDetailPurchaseOrderResult
            {
                Id = po.Id,
                VendorId = po.VendorId,
                VendorName = po.Vendor.Name,
                VendorPhone = po.Vendor.Phone,
                VendorEmail = po.Vendor.Email,
                StoreId = po.StoreId,
                StoreName = po.Store.Name,
                Status = po.Status,
                ExpectedAt = po.ExpectedAt,
                Note = po.Note,
                TotalCost = po.Items.Sum(i => i.Quantity * i.UnitCost),
                ItemCount = po.Items.Count,
                CreatedAt = po.CreatedAt,
                UpdatedAt = po.UpdatedAt,
                Items = po
                    .Items.Select(item => new PurchaseOrderItemResult
                    {
                        Id = item.Id,
                        SellableItemId = item.SellableItemId,
                        SellableItemName =
                            item.SellableItem.SneakerVariant != null
                                ? item.SellableItem.SneakerVariant.Colorway.Sneaker.Name
                            : item.SellableItem.Accessory != null ? item.SellableItem.Accessory.Name
                            : "Unknown",
                        SellableType =
                            item.SellableItem.SneakerVariant != null
                                ? SellableType.SNEAKER_VARIANT
                                : SellableType.ACCESSORY,
                        ColorName =
                            item.SellableItem.SneakerVariant != null
                                ? item.SellableItem.SneakerVariant.Colorway.Color.Name
                                : null,
                        SizeName =
                            item.SellableItem.SneakerVariant != null
                                ? item.SellableItem.SneakerVariant.Size.System
                                    + " "
                                    + item.SellableItem.SneakerVariant.Size.Value
                                : null,
                        SKU = item.SellableItem.Sku,
                        Quantity = item.Quantity,
                        UnitCost = item.UnitCost,
                        TotalCost = item.Quantity * item.UnitCost,
                    })
                    .ToList(),
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (purchaseOrder == null)
        {
            throw new NotFoundException("Không tìm thấy đơn đặt hàng.");
        }

        return purchaseOrder;
    }
}
