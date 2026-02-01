using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetSneakerBySlugQueryHandler
    : IRequestHandler<GetSneakerBySlugQuery, GetSneakerDetailResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetSneakerBySlugQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetSneakerDetailResult> Handle(
        GetSneakerBySlugQuery query,
        CancellationToken cancellationToken
    )
    {
        var sneaker = await _unitOfWork
            .Sneakers.Query()
            .AsNoTracking()
            .Where(s => s.Slug == query.Slug && !s.IsDeleted)
            .Select(s => new GetSneakerDetailResult
            {
                Id = s.Id,
                Name = s.Name,
                Slug = s.Slug,
                Description = s.Description,
                MainImage = s.MainImage,
                SubImages = s
                    .SneakerSubImages.OrderBy(si => si.CreatedAt)
                    .Select(si => new SneakerDetailSubImageDto
                    {
                        Id = si.Id,
                        ImageUrl = si.ImageUrl,
                    })
                    .ToList(),
                BasePrice = s.BasePrice,
                Selled = s.Selled,
                ViewCount = s.ViewCount,
                IsActive = s.IsActive,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt,
                Brand = new SneakerDetailBrandDto
                {
                    Id = s.Brand.Id,
                    Name = s.Brand.Name,
                    Slug = s.Brand.Slug,
                    LogoUrl = s.Brand.LogoUrl,
                },
                BrandSeries =
                    s.BrandSeries != null
                        ? new SneakerDetailBrandSeriesDto
                        {
                            Id = s.BrandSeries.Id,
                            Name = s.BrandSeries.Name,
                            Slug = s.BrandSeries.Slug,
                        }
                        : null,
                Colorways = s
                    .Colorways.OrderBy(c => c.Color.Name)
                    .Select(c => new SneakerDetailColorwayDto
                    {
                        Id = c.Id,
                        Color = new SneakerDetailColorDto
                        {
                            Id = c.Color.Id,
                            Name = c.Color.Name,
                            Slug = c.Color.Slug,
                            Hex = c.Color.Hex,
                        },
                        CoverImage = c.CoverImage,
                        IsActive = c.IsActive,
                        Variants = c
                            .Variants.OrderBy(v => v.Size.System)
                            .ThenBy(v => v.Size.Value)
                            .Select(v => new SneakerDetailVariantDto
                            {
                                Id = v.Id,
                                Size = new SneakerDetailSizeDto
                                {
                                    Id = v.Size.Id,
                                    System = v.Size.System,
                                    Value = v.Size.Value,
                                },
                                Sku = v.SellableItem != null ? v.SellableItem.Sku : "",
                                RetailPrice =
                                    v.SellableItem != null ? v.SellableItem.RetailPrice : null,
                                OnlinePrice =
                                    v.SellableItem != null ? v.SellableItem.OnlinePrice : null,
                                IsActive = v.SellableItem != null && v.SellableItem.IsActive,
                                SellableItemId = v.SellableItem != null ? v.SellableItem.Id : null,
                                Inventory =
                                    v.SellableItem != null && v.SellableItem.Inventories.Any()
                                        ? v
                                            .SellableItem.Inventories.Select(
                                                inv => new SneakerDetailInventoryDto
                                                {
                                                    OnHand = inv.OnHand,
                                                    Reserved = inv.Reserved,
                                                    StoreName = inv.Store.Name,
                                                }
                                            )
                                            .FirstOrDefault()
                                        : null,
                            })
                            .ToList(),
                    })
                    .ToList(),
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (sneaker == null)
        {
            throw new NotFoundException("Không tìm thấy sản phẩm.");
        }

        return sneaker;
    }
}
