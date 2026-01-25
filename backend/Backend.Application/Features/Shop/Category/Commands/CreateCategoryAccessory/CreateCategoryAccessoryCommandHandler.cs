using MediatR;

public class CreateCategoryAccessoryCommandHandler
    : IRequestHandler<CreateCategoryAccessoryCommand, CreateCategoryAccessoryResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISlugService _slugService;
    private readonly IImageService _imageService;

    public CreateCategoryAccessoryCommandHandler(
        IUnitOfWork unitOfWork,
        ISlugService slugService,
        IImageService imageService
    )
    {
        _unitOfWork = unitOfWork;
        _slugService = slugService;
        _imageService = imageService;
    }

    public async Task<CreateCategoryAccessoryResult> Handle(
        CreateCategoryAccessoryCommand command,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            // 1. Generate unique slug for category
            var categorySlug = await _slugService.GenerateUniqueSlugAsync(
                command.Name,
                async (s) =>
                    await _unitOfWork.CategoryAccessories.ExistsBySlugAsync(s, cancellationToken)
            );

            // 2. Create CategoryAccessory entity
            var category = new CategoryAccessory
            {
                Name = command.Name.Trim(),
                Slug = categorySlug,
                IsDeleted = false,
            };

            await _unitOfWork.CategoryAccessories.AddAsync(category, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // 3. Process brands and upload images
            var brandResults = new List<BrandResultDto>();

            foreach (var brandInput in command.Brands)
            {
                // Generate unique slug for brand
                var brandSlug = await _slugService.GenerateUniqueSlugAsync(
                    brandInput.Name,
                    async (s) =>
                        await _unitOfWork.BrandCategoryAccessories.ExistsBySlugAsync(
                            s,
                            cancellationToken
                        )
                );

                // Upload brand thumbnail image
                var imageResult = await _imageService.UploadImageAsync(
                    brandInput.ThumbnailImage,
                    CloudinaryFolder.AccessoryBrands
                );

                // Create BrandCategoryAccessory entity
                var brand = new BrandCategoryAccessory
                {
                    CategoryId = category.Id,
                    Name = brandInput.Name.Trim(),
                    Slug = brandSlug,
                    ThumbnailUrl = imageResult.Url,
                    PublicId = imageResult.PublicId,
                    IsDeleted = false,
                };

                await _unitOfWork.BrandCategoryAccessories.AddAsync(brand, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                brandResults.Add(
                    new BrandResultDto
                    {
                        Id = brand.Id,
                        Name = brand.Name,
                        Slug = brand.Slug,
                        ThumbnailUrl = brand.ThumbnailUrl,
                    }
                );
            }

            // 4. Build result
            return new CreateCategoryAccessoryResult
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug,
                CreatedAt = category.CreatedAt,
                Brands = brandResults,
            };
        });
    }
}
