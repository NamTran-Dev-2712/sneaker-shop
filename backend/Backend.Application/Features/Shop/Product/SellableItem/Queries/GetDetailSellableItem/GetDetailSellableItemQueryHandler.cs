using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetDetailSellableItemQueryHandler
    : IRequestHandler<GetDetailSellableItemQuery, GetDetailSellableItemResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetDetailSellableItemQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetDetailSellableItemResult> Handle(
        GetDetailSellableItemQuery query,
        CancellationToken cancellationToken
    )
    {
        var now = DateTime.UtcNow;

        var sellableItem = await _unitOfWork
            .SellableItems.Query()
            .AsNoTracking()
            .Where(s => s.Id == query.Id)
            .Select(s => new GetDetailSellableItemResult
            {
                Id = s.Id,
                Type = s.Type,
                Sku = s.Sku,
                Barcode = s.Barcode,
                RetailPrice = s.RetailPrice,
                OnlinePrice = s.OnlinePrice,
                IsActive = s.IsActive,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt,
                Product =
                    s.SneakerVariant != null
                        ? new ProductInfo
                        {
                            Id = s.SneakerVariant.Colorway.SneakerId,
                            Name = s.SneakerVariant.Colorway.Sneaker.Name,
                            Image = s.SneakerVariant.Colorway.CoverImage,
                            BrandName = s.SneakerVariant.Colorway.Sneaker.Brand.Name,
                            CategoryName =
                                s.SneakerVariant.Colorway.Sneaker.BrandSeries != null
                                    ? s.SneakerVariant.Colorway.Sneaker.BrandSeries.Name
                                    : null,
                            ColorName = s.SneakerVariant.Colorway.Color.Name,
                            SizeName =
                                s.SneakerVariant.Size.System + " " + s.SneakerVariant.Size.Value,
                            Description = s.SneakerVariant.Colorway.Sneaker.Description,
                        }
                    : s.Accessory != null
                        ? new ProductInfo
                        {
                            Id = s.Accessory.Id,
                            Name = s.Accessory.Name,
                            Image = s.Accessory.MainImage,
                            BrandName = s.Accessory.Brand.Name,
                            CategoryName = s.Accessory.Category.Name,
                            ColorName = null,
                            SizeName = null,
                            Description = s.Accessory.Description,
                        }
                    : null,
                Inventories = s
                    .Inventories.Select(inv => new StoreInventoryInfo
                    {
                        Id = inv.Id,
                        StoreId = inv.StoreId,
                        StoreName = inv.Store.Name,
                        OnHand = inv.OnHand,
                        Reserved = inv.Reserved,
                        Available = inv.OnHand - inv.Reserved,
                    })
                    .ToList(),
                VendorPrices = s
                    .VendorPrices.Where(vp => !vp.Vendor.IsDeleted)
                    .OrderByDescending(vp => vp.EffectiveFrom)
                    .Select(vp => new VendorPriceInfo
                    {
                        Id = vp.Id,
                        VendorId = vp.VendorId,
                        VendorName = vp.Vendor.Name,
                        Cost = vp.Price,
                        EffectiveFrom = vp.EffectiveFrom,
                        EffectiveTo = vp.EffectiveTo,
                        IsCurrentlyEffective =
                            vp.EffectiveFrom <= now
                            && (vp.EffectiveTo == null || vp.EffectiveTo >= now),
                    })
                    .ToList(),
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (sellableItem == null)
        {
            throw new NotFoundException($"SellableItem with Id {query.Id} not found");
        }

        return sellableItem;
    }
}
