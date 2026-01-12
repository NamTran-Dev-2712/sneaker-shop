using MediatR;

public class UpdateBrandCommandHandler : IRequestHandler<UpdateBrandCommand, UpdateBrandResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISlugService _slugService;
    private readonly IImageService _imageService;

    public UpdateBrandCommandHandler(
        IUnitOfWork unitOfWork,
        ISlugService slugService,
        IImageService imageService
    )
    {
        _unitOfWork = unitOfWork;
        _slugService = slugService;
        _imageService = imageService;
    }

    public async Task<UpdateBrandResult> Handle(
        UpdateBrandCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get existing brand
        var brand = await _unitOfWork.Brands.GetByIdAsync(command.Id, cancellationToken);
        if (brand == null || brand.IsDeleted)
        {
            throw new NotFoundException("Không tìm thấy thương hiệu.");
        }

        // 2. Check if name changed, regenerate slug
        var newSlug = brand.Slug;
        if (!brand.Name.Equals(command.Name.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            newSlug = await _slugService.GenerateUniqueSlugAsync(
                command.Name,
                async (s) => await _unitOfWork.Brands.ExistsBySlugAsync(s, command.Id)
            );
        }

        // 3. Upload new logo if provided (auto-delete old one)
        ImageUploadResult? newLogoUpload = null;
        if (command.Logo != null)
        {
            newLogoUpload = await _imageService.ReplaceImageAsync(
                command.Logo,
                CloudinaryFolder.Brands,
                brand.PublicIdLogo
            );
        }

        // 4. Update brand using domain method
        brand.UpdateInfo(
            command.Name.Trim(),
            newSlug,
            newLogoUpload?.Url ?? brand.LogoUrl,
            newLogoUpload?.PublicId ?? brand.PublicIdLogo
        );
        brand.IsActive = command.IsActive;

        // 5. Save changes
        _unitOfWork.Brands.Update(brand);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 6. Return result
        return new UpdateBrandResult
        {
            Id = brand.Id,
            Name = brand.Name,
            Slug = brand.Slug,
            LogoUrl = brand.LogoUrl,
            IsActive = brand.IsActive,
            UpdatedAt = brand.UpdatedAt,
        };
    }
}
