using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetDetailAccessoryQueryHandler
    : IRequestHandler<GetDetailAccessoryQuery, GetDetailAccessoryResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetDetailAccessoryQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetDetailAccessoryResult> Handle(
        GetDetailAccessoryQuery query,
        CancellationToken cancellationToken
    )
    {
        var result = await _unitOfWork
            .Accessories.Query()
            .AsNoTracking()
            .Where(a => a.Id == query.Id && !a.IsDeleted)
            .Select(a => new GetDetailAccessoryResult
            {
                Id = a.Id,
                Name = a.Name,
                Slug = a.Slug,
                MainImage = a.MainImage,
                Description = a.Description,
                BasePrice = a.BasePrice,
                CreatedAt = a.CreatedAt,
                UpdatedAt = a.UpdatedAt,
                Category = new AccessoryDetailCategoryDto
                {
                    Id = a.Category.Id,
                    Name = a.Category.Name,
                    Slug = a.Category.Slug,
                },
                Brand = new AccessoryDetailBrandDto
                {
                    Id = a.Brand.Id,
                    Name = a.Brand.Name,
                    Slug = a.Brand.Slug,
                    ThumbnailUrl = a.Brand.ThumbnailUrl,
                },
                Images = a
                    .Images.OrderBy(img => img.CreatedAt)
                    .Select(img => new AccessoryDetailImageDto
                    {
                        Id = img.Id,
                        ImageUrl = img.ImageUrl,
                        CreatedAt = img.CreatedAt,
                    })
                    .ToList(),
                SellableItem =
                    a.SellableItem != null
                        ? new AccessoryDetailSellableItemDto
                        {
                            Id = a.SellableItem.Id,
                            Sku = a.SellableItem.Sku,
                            Barcode = a.SellableItem.Barcode,
                            RetailPrice = a.SellableItem.RetailPrice,
                            OnlinePrice = a.SellableItem.OnlinePrice,
                            IsActive = a.SellableItem.IsActive,
                            Inventory = a.SellableItem.Inventories.Any()
                                ? a
                                    .SellableItem.Inventories.Select(
                                        inv => new AccessoryDetailInventoryDto
                                        {
                                            OnHand = inv.OnHand,
                                            Reserved = inv.Reserved,
                                            StoreName = inv.Store.Name,
                                        }
                                    )
                                    .FirstOrDefault()
                                : null,
                        }
                        : null,
            })
            .FirstOrDefaultAsync(cancellationToken);

        return result ?? throw new NotFoundException("Không tìm thấy sản phẩm phụ kiện.");
    }
}
