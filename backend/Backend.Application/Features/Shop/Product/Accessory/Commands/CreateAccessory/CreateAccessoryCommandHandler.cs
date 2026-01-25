using MediatR;

public class CreateAccessoryCommandHandler
    : IRequestHandler<CreateAccessoryCommand, CreateAccessoryResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISlugService _slugService;
    private readonly IImageService _imageService;

    public CreateAccessoryCommandHandler(
        IUnitOfWork unitOfWork,
        ISlugService slugService,
        IImageService imageService
    )
    {
        _unitOfWork = unitOfWork;
        _slugService = slugService;
        _imageService = imageService;
    }

    public async Task<CreateAccessoryResult> Handle(
        CreateAccessoryCommand command,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            // 1. Validate category and brand exist
            var category =
                await _unitOfWork.CategoryAccessories.GetByIdAsync(
                    command.CategoryId,
                    cancellationToken
                ) ?? throw new NotFoundException("Không tìm thấy danh mục phụ kiện.");

            var brand =
                await _unitOfWork.BrandCategoryAccessories.GetByIdAsync(
                    command.BrandId,
                    cancellationToken
                ) ?? throw new NotFoundException("Không tìm thấy thương hiệu phụ kiện.");

            // Validate brand belongs to category
            if (brand.CategoryId != command.CategoryId)
            {
                throw new BadException("Thương hiệu không thuộc danh mục đã chọn.");
            }

            // 2. Generate unique slug
            var slug = await _slugService.GenerateUniqueSlugAsync(
                command.Name,
                async (s) => await _unitOfWork.Accessories.ExistsBySlugAsync(s, cancellationToken)
            );

            // 3. Upload main image
            var mainImageResult = await _imageService.UploadImageAsync(
                command.MainImage,
                CloudinaryFolder.Accessories
            );

            // 4. Create Accessory entity
            var accessory = new Accessory
            {
                CategoryId = command.CategoryId,
                BrandId = command.BrandId,
                Name = command.Name.Trim(),
                Slug = slug,
                Description = command.Description?.Trim(),
                MainImage = mainImageResult.Url,
                PublicId = mainImageResult.PublicId,
                BasePrice = command.OnlinePrice ?? command.RetailPrice,
                IsDeleted = false,
            };

            await _unitOfWork.Accessories.AddAsync(accessory, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // 5. Upload and save sub-images if provided
            var subImageResults = new List<AccessoryImageDto>();
            if (command.SubImages != null && command.SubImages.Count > 0)
            {
                // Upload images in parallel for better performance
                var uploadTasks = command.SubImages.Select(async img =>
                {
                    var imageResult = await _imageService.UploadImageAsync(
                        img,
                        CloudinaryFolder.AccessoryImages
                    );
                    return imageResult;
                });

                var uploadResults = await Task.WhenAll(uploadTasks);

                foreach (var imageResult in uploadResults)
                {
                    var accessoryImage = new AccessoryImage
                    {
                        AccessoryId = accessory.Id,
                        ImageUrl = imageResult.Url,
                        PublicId = imageResult.PublicId,
                    };

                    await _unitOfWork.AccessoryImages.AddAsync(accessoryImage, cancellationToken);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);

                    subImageResults.Add(
                        new AccessoryImageDto
                        {
                            Id = accessoryImage.Id,
                            ImageUrl = accessoryImage.ImageUrl,
                        }
                    );
                }
            }

            // 6. Generate SKU and create SellableItem
            var sku = await _unitOfWork.SellableItems.GenerateAccessorySkuAsync(
                category.Name,
                brand.Name
            );

            var sellableItem = new SellableItem
            {
                Type = SellableType.ACCESSORY,
                AccessoryId = accessory.Id,
                Sku = sku,
                RetailPrice = command.RetailPrice,
                OnlinePrice = command.OnlinePrice,
                IsActive = true,
            };

            await _unitOfWork.SellableItems.AddAsync(sellableItem, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // 7. Build result
            return new CreateAccessoryResult
            {
                Id = accessory.Id,
                Name = accessory.Name,
                Slug = accessory.Slug,
                MainImage = accessory.MainImage,
                Description = accessory.Description,
                BasePrice = accessory.BasePrice,
                Category = new AccessoryCategoryDto
                {
                    Id = category.Id,
                    Name = category.Name,
                    Slug = category.Slug,
                },
                Brand = new AccessoryBrandDto
                {
                    Id = brand.Id,
                    Name = brand.Name,
                    Slug = brand.Slug,
                    ThumbnailUrl = brand.ThumbnailUrl,
                },
                SubImages = subImageResults,
                SellableItem = new AccessorySellableItemDto
                {
                    Id = sellableItem.Id,
                    Sku = sellableItem.Sku,
                    RetailPrice = sellableItem.RetailPrice,
                    OnlinePrice = sellableItem.OnlinePrice,
                    IsActive = sellableItem.IsActive,
                },
                CreatedAt = accessory.CreatedAt,
            };
        });
    }
}
