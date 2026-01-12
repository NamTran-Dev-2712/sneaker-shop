using MediatR;

public class UpdateBrandSeriesCommandHandler
    : IRequestHandler<UpdateBrandSeriesCommand, UpdateBrandSeriesResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISlugService _slugService;

    public UpdateBrandSeriesCommandHandler(IUnitOfWork unitOfWork, ISlugService slugService)
    {
        _unitOfWork = unitOfWork;
        _slugService = slugService;
    }

    public async Task<UpdateBrandSeriesResult> Handle(
        UpdateBrandSeriesCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get existing brand series
        var brandSeries = await _unitOfWork.BrandSeries.GetByIdAsync(command.Id, cancellationToken);
        if (brandSeries == null || brandSeries.IsDeleted)
        {
            throw new NotFoundException("Không tìm thấy dòng sản phẩm.");
        }

        // 2. Verify brand exists and matches
        if (brandSeries.BrandId != command.BrandId)
        {
            throw new BadException("Dòng sản phẩm không thuộc thương hiệu này.");
        }

        // 3. Check if name changed, regenerate slug
        var newSlug = brandSeries.Slug;
        if (!brandSeries.Name.Equals(command.Name.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            newSlug = await _slugService.GenerateUniqueSlugAsync(
                command.Name,
                async (s) => await _unitOfWork.BrandSeries.ExistsBySlugAsync(s, command.Id)
            );
        }

        // 4. Update using domain method
        brandSeries.UpdateInfo(command.Name.Trim(), newSlug);
        brandSeries.IsActive = command.IsActive;

        // 5. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 6. Return result
        return new UpdateBrandSeriesResult
        {
            Id = brandSeries.Id,
            BrandId = brandSeries.BrandId,
            Name = brandSeries.Name,
            Slug = brandSeries.Slug,
            IsActive = brandSeries.IsActive,
            UpdatedAt = brandSeries.UpdatedAt,
        };
    }
}
