using MediatR;

public class UpdateAccessoryCommandHandler
    : IRequestHandler<UpdateAccessoryCommand, UpdateAccessoryResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISlugService _slugService;
    private readonly IImageService _imageService;

    public UpdateAccessoryCommandHandler(
        IUnitOfWork unitOfWork,
        ISlugService slugService,
        IImageService imageService
    )
    {
        _unitOfWork = unitOfWork;
        _slugService = slugService;
        _imageService = imageService;
    }

    public async Task<UpdateAccessoryResult> Handle(
        UpdateAccessoryCommand command,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            // 1. Get existing accessory
            var accessory =
                await _unitOfWork.Accessories.GetByIdAsync(command.Id, cancellationToken)
                ?? throw new NotFoundException("Không tìm thấy sản phẩm phụ kiện.");

            int imagesAdded = 0;
            int imagesRemoved = 0;

            // 2. Update category if changed
            if (command.CategoryId.HasValue && command.CategoryId.Value != accessory.CategoryId)
            {
                var category =
                    await _unitOfWork.CategoryAccessories.GetByIdAsync(
                        command.CategoryId.Value,
                        cancellationToken
                    ) ?? throw new NotFoundException("Không tìm thấy danh mục phụ kiện.");
                accessory.CategoryId = command.CategoryId.Value;
            }

            // 3. Update brand if changed
            if (command.BrandId.HasValue && command.BrandId.Value != accessory.BrandId)
            {
                var brand =
                    await _unitOfWork.BrandCategoryAccessories.GetByIdAsync(
                        command.BrandId.Value,
                        cancellationToken
                    ) ?? throw new NotFoundException("Không tìm thấy thương hiệu phụ kiện.");

                // Validate brand belongs to category
                if (brand.CategoryId != accessory.CategoryId)
                {
                    throw new BadException("Thương hiệu không thuộc danh mục đã chọn.");
                }
                accessory.BrandId = command.BrandId.Value;
            }

            // 4. Update name and slug if provided
            var newName = accessory.Name;
            var newSlug = accessory.Slug;
            if (!string.IsNullOrEmpty(command.Name) && command.Name != accessory.Name)
            {
                newName = command.Name.Trim();
                newSlug = await _slugService.GenerateUniqueSlugAsync(
                    command.Name,
                    async (s) =>
                        await _unitOfWork.Accessories.ExistsBySlugAsync(s, cancellationToken)
                        && s != accessory.Slug
                );
            }

            // 5. Update main image if provided
            var mainImage = accessory.MainImage;
            if (command.MainImage != null)
            {
                var imageResult = await _imageService.ReplaceImageAsync(
                    command.MainImage,
                    CloudinaryFolder.Accessories,
                    accessory.PublicId
                );
                mainImage = imageResult.Url;
                accessory.PublicId = imageResult.PublicId;
            }

            // 6. Update accessory info
            accessory.UpdateInfo(
                newName,
                newSlug,
                command.Description?.Trim() ?? accessory.Description,
                mainImage,
                command.OnlinePrice ?? command.RetailPrice ?? accessory.BasePrice
            );

            // 7. Remove images
            if (command.ImageIdsToRemove != null && command.ImageIdsToRemove.Count > 0)
            {
                foreach (var imageId in command.ImageIdsToRemove)
                {
                    var image = await _unitOfWork.AccessoryImages.GetByIdAsync(
                        imageId,
                        cancellationToken
                    );
                    if (image != null && image.AccessoryId == accessory.Id)
                    {
                        // Delete from Cloudinary
                        if (!string.IsNullOrEmpty(image.PublicId))
                        {
                            await _imageService.DeleteImageAsync(image.PublicId);
                        }
                        _unitOfWork.AccessoryImages.Remove(image);
                        imagesRemoved++;
                    }
                }
            }

            // 8. Add new images
            if (command.ImagesToAdd != null && command.ImagesToAdd.Count > 0)
            {
                // Upload in parallel
                var uploadTasks = command.ImagesToAdd.Select(async img =>
                {
                    return await _imageService.UploadImageAsync(
                        img,
                        CloudinaryFolder.AccessoryImages
                    );
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
                    imagesAdded++;
                }
            }

            // 9. Update SellableItem prices if provided
            var sellableItem = await _unitOfWork.SellableItems.GetByAccessoryIdAsync(
                accessory.Id,
                cancellationToken
            );
            if (sellableItem != null)
            {
                if (command.RetailPrice.HasValue || command.OnlinePrice.HasValue)
                {
                    sellableItem.UpdatePrices(
                        command.RetailPrice ?? sellableItem.RetailPrice,
                        command.OnlinePrice ?? sellableItem.OnlinePrice
                    );
                }
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // 10. Get updated data for result
            var resultCategory = await _unitOfWork.CategoryAccessories.GetByIdAsync(
                accessory.CategoryId,
                cancellationToken
            );
            var resultBrand = await _unitOfWork.BrandCategoryAccessories.GetByIdAsync(
                accessory.BrandId,
                cancellationToken
            );
            var resultImages = await _unitOfWork.AccessoryImages.GetByAccessoryIdAsync(
                accessory.Id,
                cancellationToken
            );

            return new UpdateAccessoryResult
            {
                Id = accessory.Id,
                Name = accessory.Name,
                Slug = accessory.Slug,
                MainImage = accessory.MainImage,
                Description = accessory.Description,
                BasePrice = accessory.BasePrice,
                Category = new AccessoryCategoryDto
                {
                    Id = resultCategory!.Id,
                    Name = resultCategory.Name,
                    Slug = resultCategory.Slug,
                },
                Brand = new AccessoryBrandDto
                {
                    Id = resultBrand!.Id,
                    Name = resultBrand.Name,
                    Slug = resultBrand.Slug,
                    ThumbnailUrl = resultBrand.ThumbnailUrl,
                },
                SubImages = resultImages
                    .Select(i => new AccessoryImageDto { Id = i.Id, ImageUrl = i.ImageUrl })
                    .ToList(),
                SellableItem =
                    sellableItem != null
                        ? new AccessorySellableItemDto
                        {
                            Id = sellableItem.Id,
                            Sku = sellableItem.Sku,
                            RetailPrice = sellableItem.RetailPrice,
                            OnlinePrice = sellableItem.OnlinePrice,
                            IsActive = sellableItem.IsActive,
                        }
                        : null!,
                UpdatedAt = accessory.UpdatedAt,
                ImagesAdded = imagesAdded,
                ImagesRemoved = imagesRemoved,
            };
        });
    }
}
