using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetDetailVendorQueryHandler
    : IRequestHandler<GetDetailVendorQuery, GetDetailVendorResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetDetailVendorQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetDetailVendorResult> Handle(
        GetDetailVendorQuery query,
        CancellationToken cancellationToken
    )
    {
        var vendor = await _unitOfWork
            .Vendors.Query()
            .AsNoTracking()
            .Where(v => v.Id == query.Id && !v.IsDeleted)
            .Select(v => new GetDetailVendorResult
            {
                Id = v.Id,
                Name = v.Name,
                Phone = v.Phone,
                Email = v.Email,
                Address = v.Address,
                IsActive = v.IsActive,
                CreatedAt = v.CreatedAt,
                UpdatedAt = v.UpdatedAt,
                TotalPurchaseOrders = v.PurchaseOrders.Count,
                PendingPurchaseOrders = v.PurchaseOrders.Count(po =>
                    po.Status == PurchaseStatus.CREATED || po.Status == PurchaseStatus.ORDERED
                ),
                VendorPrices = v
                    .VendorPrices.OrderByDescending(vp => vp.EffectiveFrom)
                    .Select(vp => new VendorPriceDto
                    {
                        Id = vp.Id,
                        SellableItemId = vp.SellableItemId,
                        Sku = vp.SellableItem.Sku,
                        ProductName =
                            vp.SellableItem.SneakerVariant != null
                                ? vp.SellableItem.SneakerVariant.Sneaker.Name
                                    + " - "
                                    + vp.SellableItem.SneakerVariant.Colorway.Color.Name
                                    + " - "
                                    + vp.SellableItem.SneakerVariant.Size.System
                                    + " "
                                    + vp.SellableItem.SneakerVariant.Size.Value
                            : vp.SellableItem.Accessory != null ? vp.SellableItem.Accessory.Name
                            : "Unknown",
                        ProductType = vp.SellableItem.Type,
                        Price = vp.Price,
                        EffectiveFrom = vp.EffectiveFrom,
                        EffectiveTo = vp.EffectiveTo,
                        IsCurrentlyEffective =
                            vp.EffectiveFrom <= DateTime.UtcNow
                            && (vp.EffectiveTo == null || vp.EffectiveTo >= DateTime.UtcNow),
                    })
                    .ToList(),
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (vendor == null)
        {
            throw new NotFoundException("Không tìm thấy nhà cung cấp.");
        }

        return vendor;
    }
}
