using MediatR;
using Microsoft.EntityFrameworkCore;

public record GetAllBrandQuery : IRequest<List<GetAllBrandResult>>;

public class GetAllBrandQueryHandler : IRequestHandler<GetAllBrandQuery, List<GetAllBrandResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAllBrandQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<GetAllBrandResult>> Handle(
        GetAllBrandQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork
            .Brands.Query()
            .AsNoTracking()
            .Where(b => !b.IsDeleted)
            .OrderBy(b => b.Name)
            .Select(b => new GetAllBrandResult
            {
                Id = b.Id,
                Name = b.Name,
                Slug = b.Slug,
                LogoUrl = b.LogoUrl,
                IsActive = b.IsActive,
                SeriesCount = b.BrandSeries.Count(s => !s.IsDeleted),
                Series = b
                    .BrandSeries.Where(s => !s.IsDeleted)
                    .OrderBy(s => s.Name)
                    .Select(s => new GetAllBrandSeriesDto
                    {
                        Id = s.Id,
                        Name = s.Name,
                        Slug = s.Slug,
                        IsActive = s.IsActive,
                        SneakerCount = s.Sneakers.Count(sn => !sn.IsDeleted),
                    })
                    .ToList(),
                CreatedAt = b.CreatedAt,
            })
            .ToListAsync(cancellationToken);
    }
}
