using MediatR;

public class CreateSneakerCommandHandler
    : IRequestHandler<CreateSneakerCommand, CreateSneakerResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISlugService _slugService;
    private readonly IImageService _imageService;

    public CreateSneakerCommandHandler(
        IUnitOfWork unitOfWork,
        ISlugService slugService,
        IImageService imageService
    )
    {
        _unitOfWork = unitOfWork;
        _slugService = slugService;
        _imageService = imageService;
    }

    public async Task<CreateSneakerResult> Handle(
        CreateSneakerCommand command,
        CancellationToken cancellationToken
    )
    {
        // Execute entire operation within transaction using ExecutionStrategy
        return await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            // 1. Get brand info for SKU generation
            var brand = await _unitOfWork.Brands.GetByIdAsync(command.BrandId, cancellationToken);
            if (brand == null)
                throw new NotFoundException("Không tìm thấy thương hiệu.");

            // 2. Generate unique slug
            var slug = await _slugService.GenerateUniqueSlugAsync(
                command.Name,
                async (s) => await _unitOfWork.Sneakers.ExistsBySlugAsync(s)
            );

            // 3. Upload main image
            var mainImageResult = await _imageService.UploadImageAsync(
                command.MainImage,
                CloudinaryFolder.Sneakers
            );

            // 4. Create Sneaker entity
            var sneaker = new Sneaker
            {
                BrandId = command.BrandId,
                BrandSeriesId = command.BrandSeriesId,
                Name = command.Name.Trim(),
                Slug = slug,
                Description = command.Description?.Trim(),
                MainImage = mainImageResult.Url,
                PublicId = mainImageResult.PublicId,
                IsActive = true,
                IsDeleted = false,
            };

            await _unitOfWork.Sneakers.AddAsync(sneaker, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // 5. Upload and save sub-images if provided
            var subImageResults = new List<SubImageDto>();
            if (command.SubImages != null && command.SubImages.Count > 0)
            {
                foreach (var subImage in command.SubImages)
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

                    subImageResults.Add(
                        new SubImageDto
                        {
                            Id = sneakerSubImage.Id,
                            ImageUrl = sneakerSubImage.ImageUrl,
                        }
                    );
                }

                // Save all sub-images at once
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            // 6. Process each colorway
            var colorwayResults = new List<ColorwayDto>();
            decimal? minPrice = null;

            foreach (var colorwayInput in command.Colorways)
            {
                // 6a. Get or create color
                int colorId;
                Color color;

                if (colorwayInput.ColorId.HasValue)
                {
                    color =
                        await _unitOfWork.Colors.GetByIdAsync(
                            colorwayInput.ColorId.Value,
                            cancellationToken
                        )
                        ?? throw new NotFoundException(
                            $"Không tìm thấy màu với Id {colorwayInput.ColorId}."
                        );
                    colorId = color.Id;
                }
                else if (colorwayInput.NewColor != null)
                {
                    // Create inline color
                    var colorSlug = await _slugService.GenerateUniqueSlugAsync(
                        colorwayInput.NewColor.Name,
                        async (s) => await _unitOfWork.Colors.ExistsBySlugAsync(s)
                    );

                    color = new Color
                    {
                        Name = colorwayInput.NewColor.Name.Trim(),
                        Slug = colorSlug,
                        Hex = colorwayInput.NewColor.Hex.Trim().ToUpper(),
                    };

                    await _unitOfWork.Colors.AddAsync(color, cancellationToken);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                    colorId = color.Id;
                }
                else
                {
                    throw new BadException("Phải chọn màu hiện có hoặc tạo màu mới.");
                }

                // 6b. Upload cover image for colorway
                var coverImageResult = await _imageService.UploadImageAsync(
                    colorwayInput.CoverImage,
                    CloudinaryFolder.SneakerColorways
                );

                // 6c. Create SneakerColorway
                var colorway = new SneakerColorway
                {
                    SneakerId = sneaker.Id,
                    ColorId = colorId,
                    CoverImage = coverImageResult.Url,
                    PublicId = coverImageResult.PublicId,
                    IsActive = true,
                };

                await _unitOfWork.SneakerColorways.AddAsync(colorway, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // 6d. Process each variant (size)
                var variantResults = new List<VariantDto>();

                foreach (var variantInput in colorwayInput.Variants)
                {
                    var size =
                        await _unitOfWork.Sizes.GetByIdAsync(variantInput.SizeId, cancellationToken)
                        ?? throw new NotFoundException(
                            $"Không tìm thấy size với Id {variantInput.SizeId}."
                        );

                    // Create SneakerVariant
                    var variant = new SneakerVariant
                    {
                        SneakerId = sneaker.Id,
                        ColorwayId = colorway.Id,
                        SizeId = size.Id,
                    };

                    await _unitOfWork.SneakerVariants.AddAsync(variant, cancellationToken);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);

                    // Generate unique SKU and create SellableItem
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

                    // Track min price for basePrice
                    var effectivePrice = variantInput.OnlinePrice ?? variantInput.RetailPrice;
                    if (
                        effectivePrice.HasValue && (!minPrice.HasValue || effectivePrice < minPrice)
                    )
                    {
                        minPrice = effectivePrice;
                    }

                    variantResults.Add(
                        new VariantDto
                        {
                            Id = variant.Id,
                            Size = new SizeDto
                            {
                                Id = size.Id,
                                System = size.System,
                                Value = size.Value,
                            },
                            Sku = sku,
                            RetailPrice = sellableItem.RetailPrice,
                            OnlinePrice = sellableItem.OnlinePrice,
                        }
                    );
                }

                colorwayResults.Add(
                    new ColorwayDto
                    {
                        Id = colorway.Id,
                        Color = new ColorDto
                        {
                            Id = color.Id,
                            Name = color.Name,
                            Hex = color.Hex,
                        },
                        CoverImage = coverImageResult.Url,
                        Variants = variantResults,
                    }
                );
            }

            // 7. Update sneaker base price (min of all variant prices)
            if (minPrice.HasValue)
            {
                sneaker.BasePrice = minPrice;
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            // 8. Build result
            var brandSeries = await _unitOfWork.BrandSeries.GetByIdAsync(
                command.BrandSeriesId,
                cancellationToken
            );

            BrandSeriesDto? brandSeriesDto = null;
            if (brandSeries != null)
            {
                brandSeriesDto = new BrandSeriesDto
                {
                    Id = brandSeries.Id,
                    Name = brandSeries.Name,
                    Slug = brandSeries.Slug,
                    IsActive = brandSeries.IsActive,
                    SneakerCount = 0,
                };
            }

            return new CreateSneakerResult
            {
                Id = sneaker.Id,
                Name = sneaker.Name,
                Slug = sneaker.Slug,
                MainImage = sneaker.MainImage,
                SubImages = subImageResults,
                Description = sneaker.Description,
                Brand = new BrandDto { Id = brand.Id, Name = brand.Name },
                BrandSeries = brandSeriesDto,
                Colorways = colorwayResults,
                CreatedAt = sneaker.CreatedAt,
            };
        });
    }
}
