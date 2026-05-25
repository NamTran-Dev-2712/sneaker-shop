using MediatR;

public class CreateBrandCommandHandler : IRequestHandler<CreateBrandCommand, CreateBrandResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISlugService _slugService;
    private readonly IImageService _imageService;

    public CreateBrandCommandHandler(
        IUnitOfWork unitOfWork,
        ISlugService slugService,
        IImageService imageService
    )
    {
        _unitOfWork = unitOfWork;
        _slugService = slugService;
        _imageService = imageService;
    }

    public async Task<CreateBrandResult> Handle(
        CreateBrandCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Generate unique slug
        var slug = await _slugService.GenerateUniqueSlugAsync(
            command.Name,
            async (s) => await _unitOfWork.Brands.ExistsBySlugAsync(s)
        );

        // 2. Upload logo to Cloudinary
        var logoUpload = await _imageService.UploadImageAsync(
            command.Logo,
            CloudinaryFolder.Brands
        );

        // 3. Create brand entity
        var brand = new Brand
        {
            Name = command.Name.Trim(),
            Slug = slug,
            LogoUrl = logoUpload.Url,
            PublicIdLogo = logoUpload.PublicId,
            IsActive = true,
            IsDeleted = false,
        };

        // 4. Save to database
        await _unitOfWork.Brands.AddAsync(brand, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 5. Return result
        return new CreateBrandResult
        {
            Id = brand.Id,
            Name = brand.Name,
            Slug = brand.Slug,
            LogoUrl = brand.LogoUrl,
            IsActive = brand.IsActive,
            CreatedAt = brand.CreatedAt,
        };
    }
}
