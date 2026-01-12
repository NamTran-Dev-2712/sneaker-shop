using MediatR;

public class CreateBrandSeriesCommandHandler
    : IRequestHandler<CreateBrandSeriesCommand, CreateBrandSeriesResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISlugService _slugService;

    public CreateBrandSeriesCommandHandler(IUnitOfWork unitOfWork, ISlugService slugService)
    {
        _unitOfWork = unitOfWork;
        _slugService = slugService;
    }

    public async Task<CreateBrandSeriesResult> Handle(
        CreateBrandSeriesCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Generate unique slug
        var slug = await _slugService.GenerateUniqueSlugAsync(
            command.Name,
            async (s) => await _unitOfWork.BrandSeries.ExistsBySlugAsync(s)
        );

        // 2. Create brand series entity
        var brandSeries = new BrandSeries
        {
            BrandId = command.BrandId,
            Name = command.Name.Trim(),
            Slug = slug,
            IsActive = true,
            IsDeleted = false,
        };

        // 3. Save to database
        await _unitOfWork.BrandSeries.AddAsync(brandSeries, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 4. Return result
        return new CreateBrandSeriesResult
        {
            Id = brandSeries.Id,
            BrandId = brandSeries.BrandId,
            Name = brandSeries.Name,
            Slug = brandSeries.Slug,
            IsActive = brandSeries.IsActive,
            CreatedAt = brandSeries.CreatedAt,
        };
    }
}
