using MediatR;

public class DeleteCategoryAccessoryCommandHandler
    : IRequestHandler<DeleteCategoryAccessoryCommand, DeleteCategoryAccessoryResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IImageService _imageService;

    public DeleteCategoryAccessoryCommandHandler(IUnitOfWork unitOfWork, IImageService imageService)
    {
        _unitOfWork = unitOfWork;
        _imageService = imageService;
    }

    public async Task<DeleteCategoryAccessoryResult> Handle(
        DeleteCategoryAccessoryCommand command,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            // 1. Get existing category
            var category =
                await _unitOfWork.CategoryAccessories.GetByIdAsync(command.Id, cancellationToken)
                ?? throw new NotFoundException("Không tìm thấy danh mục phụ kiện.");

            // 2. Check for dependencies (accessories)
            var hasDependencies = await _unitOfWork.CategoryAccessories.HasDependenciesAsync(
                command.Id,
                cancellationToken
            );

            if (hasDependencies)
            {
                throw new BadException(
                    "Không thể xóa danh mục này vì đang có sản phẩm phụ kiện liên quan. Vui lòng xóa hoặc chuyển các sản phẩm trước."
                );
            }

            // 3. Get all brands in this category
            var brands = await _unitOfWork.BrandCategoryAccessories.GetByCategoryIdAsync(
                command.Id,
                cancellationToken
            );

            int brandsDeleted = 0;

            // 4. Soft delete all brands and delete their images
            foreach (var brand in brands)
            {
                // Check if brand has dependencies
                var brandHasDependencies =
                    await _unitOfWork.BrandCategoryAccessories.HasDependenciesAsync(
                        brand.Id,
                        cancellationToken
                    );

                if (brandHasDependencies)
                {
                    throw new BadException(
                        $"Không thể xóa thương hiệu '{brand.Name}' vì đang có sản phẩm liên quan."
                    );
                }

                // Delete image from Cloudinary
                if (!string.IsNullOrEmpty(brand.PublicId))
                {
                    await _imageService.DeleteImageAsync(brand.PublicId);
                }

                brand.SoftDelete();
                brandsDeleted++;
            }

            // 5. Soft delete category
            category.SoftDelete();

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new DeleteCategoryAccessoryResult
            {
                Id = category.Id,
                Message = $"Đã xóa danh mục '{category.Name}' thành công.",
                BrandsDeleted = brandsDeleted,
            };
        });
    }
}
