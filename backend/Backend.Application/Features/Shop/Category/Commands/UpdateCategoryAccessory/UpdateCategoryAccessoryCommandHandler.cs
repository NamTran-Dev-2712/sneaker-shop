using MediatR;

public class UpdateCategoryAccessoryCommandHandler
    : IRequestHandler<UpdateCategoryAccessoryCommand, UpdateCategoryAccessoryResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISlugService _slugService;
    private readonly IImageService _imageService;

    public UpdateCategoryAccessoryCommandHandler(
        IUnitOfWork unitOfWork,
        ISlugService slugService,
        IImageService imageService
    )
    {
        _unitOfWork = unitOfWork;
        _slugService = slugService;
        _imageService = imageService;
    }

    public async Task<UpdateCategoryAccessoryResult> Handle(
        UpdateCategoryAccessoryCommand command,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            // 1. Get existing category
            var category =
                await _unitOfWork.CategoryAccessories.GetByIdAsync(command.Id, cancellationToken)
                ?? throw new NotFoundException("Không tìm thấy danh mục phụ kiện.");

            int brandsAdded = 0;
            int brandsUpdated = 0;
            int brandsRemoved = 0;

            // 2. Update category name if provided
            if (!string.IsNullOrEmpty(command.Name) && command.Name != category.Name)
            {
                var newSlug = await _slugService.GenerateUniqueSlugAsync(
                    command.Name,
                    async (s) =>
                        await _unitOfWork.CategoryAccessories.ExistsBySlugAsync(
                            s,
                            cancellationToken
                        )
                        && s != category.Slug
                );
                category.UpdateInfo(command.Name.Trim(), newSlug);
            }

            // 3. Remove brands (check dependencies first)
            foreach (var brandId in command.BrandIdsToRemove)
            {
                var hasDependencies =
                    await _unitOfWork.BrandCategoryAccessories.HasDependenciesAsync(
                        brandId,
                        cancellationToken
                    );

                if (hasDependencies)
                {
                    throw new BadException(
                        $"Không thể xóa thương hiệu Id={brandId} vì đang có sản phẩm liên quan."
                    );
                }

                var brandToRemove = await _unitOfWork.BrandCategoryAccessories.GetByIdAsync(
                    brandId,
                    cancellationToken
                );
                if (brandToRemove != null && brandToRemove.CategoryId == command.Id)
                {
                    // Delete image from Cloudinary
                    if (!string.IsNullOrEmpty(brandToRemove.PublicId))
                    {
                        await _imageService.DeleteImageAsync(brandToRemove.PublicId);
                    }

                    brandToRemove.SoftDelete();
                    brandsRemoved++;
                }
            }

            // 4. Update existing brands
            foreach (var brandUpdate in command.BrandsToUpdate)
            {
                var brand = await _unitOfWork.BrandCategoryAccessories.GetByIdAsync(
                    brandUpdate.Id,
                    cancellationToken
                );
                if (brand != null && brand.CategoryId == command.Id)
                {
                    var newName = brandUpdate.Name?.Trim() ?? brand.Name;
                    var newSlug = brand.Slug;
                    var newThumbnailUrl = brand.ThumbnailUrl;
                    var newPublicId = brand.PublicId;

                    // Update slug if name changed
                    if (!string.IsNullOrEmpty(brandUpdate.Name) && brandUpdate.Name != brand.Name)
                    {
                        newSlug = await _slugService.GenerateUniqueSlugAsync(
                            brandUpdate.Name,
                            async (s) =>
                                await _unitOfWork.BrandCategoryAccessories.ExistsBySlugAsync(
                                    s,
                                    cancellationToken
                                )
                                && s != brand.Slug
                        );
                    }

                    // Update image if provided
                    if (brandUpdate.ThumbnailImage != null)
                    {
                        var imageResult = await _imageService.ReplaceImageAsync(
                            brandUpdate.ThumbnailImage,
                            CloudinaryFolder.AccessoryBrands,
                            brand.PublicId
                        );
                        newThumbnailUrl = imageResult.Url;
                        newPublicId = imageResult.PublicId;
                    }

                    brand.UpdateInfo(newName, newSlug, newThumbnailUrl, newPublicId);
                    brandsUpdated++;
                }
            }

            // 5. Add new brands
            foreach (var brandInput in command.BrandsToAdd)
            {
                var brandSlug = await _slugService.GenerateUniqueSlugAsync(
                    brandInput.Name,
                    async (s) =>
                        await _unitOfWork.BrandCategoryAccessories.ExistsBySlugAsync(
                            s,
                            cancellationToken
                        )
                );

                var imageResult = await _imageService.UploadImageAsync(
                    brandInput.ThumbnailImage,
                    CloudinaryFolder.AccessoryBrands
                );

                var newBrand = new BrandCategoryAccessory
                {
                    CategoryId = category.Id,
                    Name = brandInput.Name.Trim(),
                    Slug = brandSlug,
                    ThumbnailUrl = imageResult.Url,
                    PublicId = imageResult.PublicId,
                    IsDeleted = false,
                };

                await _unitOfWork.BrandCategoryAccessories.AddAsync(newBrand, cancellationToken);
                brandsAdded++;
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // 6. Get all active brands for result
            var allBrands = await _unitOfWork.BrandCategoryAccessories.GetByCategoryIdAsync(
                category.Id,
                cancellationToken
            );

            return new UpdateCategoryAccessoryResult
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                UpdatedAt = category.UpdatedAt,
                Brands = allBrands
                    .Select(b => new BrandResultDto
                    {
                        Id = b.Id,
                        Name = b.Name,
                        Slug = b.Slug,
                        ThumbnailUrl = b.ThumbnailUrl,
                    })
                    .ToList(),
                BrandsAdded = brandsAdded,
                BrandsUpdated = brandsUpdated,
                BrandsRemoved = brandsRemoved,
            };
        });
    }
}
