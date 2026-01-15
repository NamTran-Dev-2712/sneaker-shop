using System.Data;
using MediatR;

public class UpdateSneakerCommandHandler
    : IRequestHandler<UpdateSneakerCommand, UpdateSneakerResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISlugService _slugService;
    private readonly IImageService _imageService;

    public UpdateSneakerCommandHandler(
        IUnitOfWork unitOfWork,
        ISlugService slugService,
        IImageService imageService
    )
    {
        _unitOfWork = unitOfWork;
        _slugService = slugService;
        _imageService = imageService;
    }

    public async Task<UpdateSneakerResult> Handle(
        UpdateSneakerCommand command,
        CancellationToken cancellationToken
    )
    {
        // Get sneaker with colorways and variants for processing
        var sneaker = await _unitOfWork.Sneakers.GetWithColorwaysAndVariantsAsync(
            command.Id,
            cancellationToken
        );

        if (sneaker == null || sneaker.IsDeleted)
        {
            throw new NotFoundException("Không tìm thấy sản phẩm.");
        }

        // Check if we need transaction (colorway/variant/subimage changes)
        bool hasNestedChanges =
            (command.Colorways != null && command.Colorways.Count > 0)
            || (command.NewSubImages != null && command.NewSubImages.Count > 0)
            || (command.RemoveSubImageIds != null && command.RemoveSubImageIds.Count > 0);

        if (hasNestedChanges)
        {
            // Use ExecuteInTransactionAsync for execution strategy compatibility
            return await _unitOfWork.ExecuteInTransactionAsync(async () =>
                await ExecuteUpdateAsync(command, sneaker, cancellationToken)
            );
        }
        else
        {
            // Simple update without transaction
            return await ExecuteUpdateAsync(command, sneaker, cancellationToken);
        }
    }

    private async Task<UpdateSneakerResult> ExecuteUpdateAsync(
        UpdateSneakerCommand command,
        Sneaker sneaker,
        CancellationToken cancellationToken
    )
    {
        // Counters for result
        int colorwaysAdded = 0;
        int variantsAdded = 0;
        int variantsUpdated = 0;
        int subImagesAdded = 0;
        int subImagesRemoved = 0;

        // ============== PHASE 1: Update basic sneaker info ==============

        // Check if name changed, regenerate slug
        var newSlug = sneaker.Slug;
        if (!sneaker.Name.Equals(command.Name.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            newSlug = await _slugService.GenerateUniqueSlugAsync(
                command.Name,
                async (s) => await _unitOfWork.Sneakers.ExistsBySlugAsync(s, command.Id)
            );
        }

        // Upload new main image if provided
        var mainImage = sneaker.MainImage;
        var publicId = sneaker.PublicId;
        if (command.MainImage != null)
        {
            var imageResult = await _imageService.UploadImageAsync(
                command.MainImage,
                CloudinaryFolder.Sneakers
            );
            mainImage = imageResult.Url;
            publicId = imageResult.PublicId;
        }

        // Update sneaker basic info
        sneaker.BrandId = command.BrandId;
        sneaker.BrandSeriesId = command.BrandSeriesId;
        sneaker.UpdateInfo(
            command.Name.Trim(),
            newSlug,
            command.Description?.Trim(),
            mainImage,
            publicId,
            sneaker.BasePrice
        );
        sneaker.IsActive = command.IsActive;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // ============== PHASE 2: Process SubImages ==============

        // Remove existing sub-images if requested
        if (command.RemoveSubImageIds != null && command.RemoveSubImageIds.Count > 0)
        {
            foreach (var subImageId in command.RemoveSubImageIds)
            {
                var subImage = await _unitOfWork.SneakerSubImages.GetByIdAsync(
                    subImageId,
                    cancellationToken
                );
                if (subImage != null && subImage.SneakerId == sneaker.Id)
                {
                    // Delete from cloudinary
                    await _imageService.DeleteImageAsync(subImage.PublicId);
                    // Remove from database
                    _unitOfWork.SneakerSubImages.Remove(subImage);
                    subImagesRemoved++;
                }
            }
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        // Add new sub-images if provided
        if (command.NewSubImages != null && command.NewSubImages.Count > 0)
        {
            foreach (var subImage in command.NewSubImages)
            {
                var subImageResult = await _imageService.UploadImageAsync(
                    subImage,
                    CloudinaryFolder.SneakerSubImages
                );

                var sneakerSubImage = new SneakerSubImage
                {
                    SneakerId = sneaker.Id,
                    ImageUrl = subImageResult.Url,
                    PublicId = subImageResult.PublicId,
                };

                await _unitOfWork.SneakerSubImages.AddAsync(sneakerSubImage, cancellationToken);
                subImagesAdded++;
            }
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        // ============== PHASE 3: Process colorways ==============

        if (command.Colorways != null && command.Colorways.Count > 0)
        {
            // Get brand for SKU generation
            var brand = await _unitOfWork.Brands.GetByIdAsync(command.BrandId, cancellationToken);

            foreach (var colorwayInput in command.Colorways)
            {
                if (colorwayInput.Id.HasValue)
                {
                    // UPDATE existing colorway
                    var existingColorway = sneaker.Colorways.FirstOrDefault(c =>
                        c.Id == colorwayInput.Id.Value
                    );
                    if (existingColorway != null)
                    {
                        // Update cover image if provided
                        if (colorwayInput.CoverImage != null)
                        {
                            var coverResult = await _imageService.UploadImageAsync(
                                colorwayInput.CoverImage,
                                CloudinaryFolder.SneakerColorways
                            );
                            existingColorway.UpdateCoverImage(
                                coverResult.Url,
                                coverResult.PublicId
                            );
                        }

                        // Update active status if provided
                        if (colorwayInput.IsActive.HasValue)
                        {
                            if (colorwayInput.IsActive.Value)
                                existingColorway.Activate();
                            else
                                existingColorway.Deactivate();
                        }

                        // Process variants for this colorway
                        if (colorwayInput.Variants != null)
                        {
                            var (added, updated) = await ProcessVariantsAsync(
                                existingColorway,
                                colorwayInput.Variants,
                                sneaker,
                                brand!,
                                cancellationToken
                            );
                            variantsAdded += added;
                            variantsUpdated += updated;
                        }
                    }
                }
                else
                {
                    // CREATE new colorway
                    var (newColorway, added) = await CreateNewColorwayAsync(
                        colorwayInput,
                        sneaker,
                        brand!,
                        cancellationToken
                    );
                    colorwaysAdded++;
                    variantsAdded += added;
                }
            }

            // Recalculate base price (min of all variant prices)
            await RecalculateBasePriceAsync(sneaker.Id, cancellationToken);
        }

        return new UpdateSneakerResult
        {
            Id = sneaker.Id,
            Name = sneaker.Name,
            Slug = sneaker.Slug,
            MainImage = sneaker.MainImage,
            Description = sneaker.Description,
            IsActive = sneaker.IsActive,
            UpdatedAt = sneaker.UpdatedAt,
            ColorwaysAdded = colorwaysAdded,
            VariantsAdded = variantsAdded,
            VariantsUpdated = variantsUpdated,
            SubImagesAdded = subImagesAdded,
            SubImagesRemoved = subImagesRemoved,
        };
    }

    private async Task<(int Added, int Updated)> ProcessVariantsAsync(
        SneakerColorway colorway,
        List<UpdateVariantInput> variantInputs,
        Sneaker sneaker,
        Brand brand,
        CancellationToken cancellationToken
    )
    {
        int added = 0;
        int updated = 0;

        foreach (var variantInput in variantInputs)
        {
            if (variantInput.Id.HasValue)
            {
                // UPDATE existing variant
                var existingVariant = colorway.Variants.FirstOrDefault(v =>
                    v.Id == variantInput.Id.Value
                );
                if (existingVariant?.SellableItem != null)
                {
                    // Update prices if provided
                    if (variantInput.RetailPrice.HasValue || variantInput.OnlinePrice.HasValue)
                    {
                        existingVariant.SellableItem.UpdatePrices(
                            variantInput.RetailPrice ?? existingVariant.SellableItem.RetailPrice,
                            variantInput.OnlinePrice ?? existingVariant.SellableItem.OnlinePrice
                        );
                    }

                    // Update active status if provided
                    if (variantInput.IsActive.HasValue)
                    {
                        if (variantInput.IsActive.Value)
                            existingVariant.SellableItem.Activate();
                        else
                            existingVariant.SellableItem.Deactivate();
                    }

                    updated++;
                }
            }
            else if (variantInput.SizeId.HasValue)
            {
                // CREATE new variant
                var size = await _unitOfWork.Sizes.GetByIdAsync(
                    variantInput.SizeId.Value,
                    cancellationToken
                );
                if (size == null)
                    continue;

                var color = await _unitOfWork.Colors.GetByIdAsync(
                    colorway.ColorId,
                    cancellationToken
                );
                if (color == null)
                    continue;

                // Check if variant already exists
                var exists = await _unitOfWork.SneakerVariants.ExistsAsync(colorway.Id, size.Id);
                if (exists)
                    continue;

                // Create variant
                var variant = new SneakerVariant
                {
                    SneakerId = sneaker.Id,
                    ColorwayId = colorway.Id,
                    SizeId = size.Id,
                };

                await _unitOfWork.SneakerVariants.AddAsync(variant, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Generate SKU and create SellableItem
                var sku = await _unitOfWork.SellableItems.GenerateSkuAsync(
                    brand.Name,
                    sneaker.Name,
                    color.Name,
                    $"{size.System}{size.Value}"
                );

                var sellableItem = new SellableItem
                {
                    Type = SellableType.SNEAKER_VARIANT,
                    SneakerVariantId = variant.Id,
                    Sku = sku,
                    RetailPrice = variantInput.RetailPrice,
                    OnlinePrice = variantInput.OnlinePrice,
                    IsActive = true,
                };

                await _unitOfWork.SellableItems.AddAsync(sellableItem, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                added++;
            }
        }

        return (added, updated);
    }

    private async Task<(SneakerColorway Colorway, int VariantsAdded)> CreateNewColorwayAsync(
        UpdateColorwayInput input,
        Sneaker sneaker,
        Brand brand,
        CancellationToken cancellationToken
    )
    {
        // Get or create color
        Color color;
        if (input.ColorId.HasValue)
        {
            color =
                await _unitOfWork.Colors.GetByIdAsync(input.ColorId.Value, cancellationToken)
                ?? throw new NotFoundException($"Không tìm thấy màu với Id {input.ColorId}.");
        }
        else if (input.NewColor != null)
        {
            // Check if color already exists
            var existsByName = await _unitOfWork.Colors.ExistsByNameAsync(input.NewColor.Name);
            if (existsByName)
            {
                throw new BadException($"Màu '{input.NewColor.Name}' đã tồn tại.");
            }

            var colorSlug = await _slugService.GenerateUniqueSlugAsync(
                input.NewColor.Name,
                async (s) => await _unitOfWork.Colors.ExistsBySlugAsync(s)
            );

            color = new Color
            {
                Name = input.NewColor.Name.Trim(),
                Slug = colorSlug,
                Hex = input.NewColor.Hex.Trim().ToUpper(),
            };

            await _unitOfWork.Colors.AddAsync(color, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
        else
        {
            throw new BadException("Phải chọn màu hiện có hoặc tạo màu mới.");
        }

        // Check if colorway already exists for this sneaker + color
        var colorwayExists = await _unitOfWork.SneakerColorways.ExistsAsync(sneaker.Id, color.Id);
        if (colorwayExists)
        {
            throw new BadException($"Màu '{color.Name}' đã tồn tại cho sản phẩm này.");
        }

        // Upload cover image
        var coverResult = await _imageService.UploadImageAsync(
            input.CoverImage!,
            CloudinaryFolder.SneakerColorways
        );

        // Create colorway
        var colorway = new SneakerColorway
        {
            SneakerId = sneaker.Id,
            ColorId = color.Id,
            CoverImage = coverResult.Url,
            PublicId = coverResult.PublicId,
            IsActive = true,
        };

        await _unitOfWork.SneakerColorways.AddAsync(colorway, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Create variants if provided
        int variantsAdded = 0;
        if (input.Variants != null && input.Variants.Count > 0)
        {
            foreach (var variantInput in input.Variants)
            {
                if (!variantInput.SizeId.HasValue)
                    continue;

                var size = await _unitOfWork.Sizes.GetByIdAsync(
                    variantInput.SizeId.Value,
                    cancellationToken
                );
                if (size == null)
                    continue;

                var variant = new SneakerVariant
                {
                    SneakerId = sneaker.Id,
                    ColorwayId = colorway.Id,
                    SizeId = size.Id,
                };

                await _unitOfWork.SneakerVariants.AddAsync(variant, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var sku = await _unitOfWork.SellableItems.GenerateSkuAsync(
                    brand.Name,
                    sneaker.Name,
                    color.Name,
                    $"{size.System}{size.Value}"
                );

                var sellableItem = new SellableItem
                {
                    Type = SellableType.SNEAKER_VARIANT,
                    SneakerVariantId = variant.Id,
                    Sku = sku,
                    RetailPrice = variantInput.RetailPrice,
                    OnlinePrice = variantInput.OnlinePrice,
                    IsActive = true,
                };

                await _unitOfWork.SellableItems.AddAsync(sellableItem, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                variantsAdded++;
            }
        }

        return (colorway, variantsAdded);
    }

    private async Task RecalculateBasePriceAsync(int sneakerId, CancellationToken cancellationToken)
    {
        var sneaker = await _unitOfWork.Sneakers.GetWithColorwaysAndVariantsAsync(
            sneakerId,
            cancellationToken
        );
        if (sneaker == null)
            return;

        decimal? minPrice = null;

        foreach (var colorway in sneaker.Colorways)
        {
            foreach (var variant in colorway.Variants)
            {
                if (variant.SellableItem != null)
                {
                    var effectivePrice =
                        variant.SellableItem.OnlinePrice ?? variant.SellableItem.RetailPrice;
                    if (
                        effectivePrice.HasValue && (!minPrice.HasValue || effectivePrice < minPrice)
                    )
                    {
                        minPrice = effectivePrice;
                    }
                }
            }
        }

        if (minPrice.HasValue)
        {
            sneaker.BasePrice = minPrice;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
