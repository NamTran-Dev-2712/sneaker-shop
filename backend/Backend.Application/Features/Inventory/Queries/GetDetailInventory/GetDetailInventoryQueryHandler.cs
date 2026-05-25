using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetDetailInventoryQueryHandler
    : IRequestHandler<GetDetailInventoryQuery, GetDetailInventoryResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetDetailInventoryQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetDetailInventoryResult> Handle(
        GetDetailInventoryQuery query,
        CancellationToken cancellationToken
    )
    {
        var result = await _unitOfWork
            .Inventories.Query()
            .AsNoTracking()
            .Where(inv => inv.Id == query.Id)
            .Select(inv => new GetDetailInventoryResult
            {
                Id = inv.Id,
                StoreId = inv.StoreId,
                StoreName = inv.Store.Name,
                StoreAddress = inv.Store.Address,
                SellableItemId = inv.SellableItemId,
                ProductName =
                    inv.SellableItem.SneakerVariant != null
                        ? inv.SellableItem.SneakerVariant.Colorway.Sneaker.Name
                    : inv.SellableItem.Accessory != null ? inv.SellableItem.Accessory.Name
                    : "Unknown",
                SellableType =
                    inv.SellableItem.SneakerVariant != null
                        ? SellableType.SNEAKER_VARIANT
                        : SellableType.ACCESSORY,
                SKU = inv.SellableItem.Sku,
                Barcode = inv.SellableItem.Barcode,
                ColorName =
                    inv.SellableItem.SneakerVariant != null
                        ? inv.SellableItem.SneakerVariant.Colorway.Color.Name
                        : null,
                SizeName =
                    inv.SellableItem.SneakerVariant != null
                        ? inv.SellableItem.SneakerVariant.Size.System
                            + " "
                            + inv.SellableItem.SneakerVariant.Size.Value
                        : null,
                OnHand = inv.OnHand,
                Reserved = inv.Reserved,
                Available = inv.OnHand - inv.Reserved,
                ProductPrice = inv.SellableItem.RetailPrice ?? inv.SellableItem.OnlinePrice ?? 0,
                CreatedAt = inv.CreatedAt,
                UpdatedAt = inv.UpdatedAt,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (result == null)
        {
            throw new NotFoundException("Không tìm thấy thông tin tồn kho.");
        }

        return result;
    }
}
