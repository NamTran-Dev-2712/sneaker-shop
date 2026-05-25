using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetDetailCategoryAccessoryQueryHandler
    : IRequestHandler<GetDetailCategoryAccessoryQuery, GetDetailCategoryAccessoryResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetDetailCategoryAccessoryQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetDetailCategoryAccessoryResult> Handle(
        GetDetailCategoryAccessoryQuery query,
        CancellationToken cancellationToken
    )
    {
        var result = await _unitOfWork
            .CategoryAccessories.Query()
            .AsNoTracking()
            .Where(c => c.Id == query.Id && !c.IsDeleted)
            .Select(c => new GetDetailCategoryAccessoryResult
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                AccessoryCount = c.Accessories.Count(a => !a.IsDeleted),
                Brands = c
                    .Brands.Where(b => !b.IsDeleted)
                    .OrderBy(b => b.Name)
                    .Select(b => new BrandDetailDto
                    {
                        Id = b.Id,
                        Name = b.Name,
                        Slug = b.Slug,
                        ThumbnailUrl = b.ThumbnailUrl,
                        CreatedAt = b.CreatedAt,
                        AccessoryCount = b.Accessories.Count(a => !a.IsDeleted),
                    })
                    .ToList(),
            })
            .FirstOrDefaultAsync(cancellationToken);

        return result ?? throw new NotFoundException("Không tìm thấy danh mục phụ kiện.");
    }
}
