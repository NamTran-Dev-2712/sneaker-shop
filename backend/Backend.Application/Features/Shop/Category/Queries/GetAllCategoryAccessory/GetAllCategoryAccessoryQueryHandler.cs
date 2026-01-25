using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetAllCategoryAccessoryQueryHandler
    : IRequestHandler<GetAllCategoryAccessoryQuery, List<GetAllCategoryAccessoryResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAllCategoryAccessoryQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<GetAllCategoryAccessoryResult>> Handle(
        GetAllCategoryAccessoryQuery query,
        CancellationToken cancellationToken
    )
    {
        // Use AsNoTracking and projection for optimal performance
        return await _unitOfWork
            .CategoryAccessories.Query()
            .AsNoTracking()
            .Where(c => !c.IsDeleted)
            .OrderBy(c => c.Name)
            .Select(c => new GetAllCategoryAccessoryResult
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Brands = c
                    .Brands.Where(b => !b.IsDeleted)
                    .OrderBy(b => b.Name)
                    .Select(b => new BrandSummaryDto
                    {
                        Id = b.Id,
                        Name = b.Name,
                        Slug = b.Slug,
                        ThumbnailUrl = b.ThumbnailUrl,
                    })
                    .ToList(),
            })
            .ToListAsync(cancellationToken);
    }
}
