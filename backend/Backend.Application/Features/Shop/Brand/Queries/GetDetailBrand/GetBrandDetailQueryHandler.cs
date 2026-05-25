using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetBrandDetailQueryHandler : IRequestHandler<GetBrandDetailQuery, GetBrandDetailResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetBrandDetailQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetBrandDetailResult> Handle(
        GetBrandDetailQuery query,
        CancellationToken cancellationToken
    )
    {
        var result = await _unitOfWork
            .Brands.Query()
            .AsNoTracking()
            .Where(b => b.Id == query.Id && !b.IsDeleted)
            .Select(b => new GetBrandDetailResult
            {
                Id = b.Id,
                Name = b.Name,
                Slug = b.Slug,
                LogoUrl = b.LogoUrl,
                IsActive = b.IsActive,
                CreatedAt = b.CreatedAt,
                UpdatedAt = b.UpdatedAt,
                Series = b
                    .BrandSeries.Where(s => !s.IsDeleted)
                    .OrderBy(s => s.Name)
                    .Select(s => new BrandSeriesDto
                    {
                        Id = s.Id,
                        Name = s.Name,
                        Slug = s.Slug,
                        IsActive = s.IsActive,
                        SneakerCount = s.Sneakers.Count,
                    })
                    .ToList(),
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (result == null)
        {
            throw new NotFoundException("Không tìm thấy thương hiệu.");
        }

        return result;
    }
}
