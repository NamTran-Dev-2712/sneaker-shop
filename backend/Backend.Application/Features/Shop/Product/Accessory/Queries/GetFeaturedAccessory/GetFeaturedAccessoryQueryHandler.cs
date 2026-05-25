using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetFeaturedAccessoryQueryHandler
    : IRequestHandler<GetFeaturedAccessoryQuery, List<GetFeaturedAccessoryResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetFeaturedAccessoryQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<GetFeaturedAccessoryResult>> Handle(
        GetFeaturedAccessoryQuery query,
        CancellationToken cancellationToken
    )
    {
        // 1. Build base query - only not deleted accessories
        var baseQuery = _unitOfWork.Accessories.Query().AsNoTracking().Where(a => !a.IsDeleted);

        // 2. Apply sorting based on FeaturedType
        baseQuery = query.FeaturedType switch
        {
            FeaturedType.TopRated => baseQuery
                .OrderByDescending(a => a.AverageRating)
                .ThenByDescending(a => a.RatingCount),
            FeaturedType.MostViewed => baseQuery.OrderByDescending(a => a.ViewCount),
            FeaturedType.BestSelling => baseQuery
                .OrderByDescending(a => a.Selled)
                .ThenByDescending(a => a.RatingCount),
            _ => baseQuery.OrderByDescending(a => a.Selled),
        };

        // 3. Take limit and project
        var items = await baseQuery
            .Take(query.Limit)
            .Select(a => new GetFeaturedAccessoryResult
            {
                Id = a.Id,
                Name = a.Name,
                Slug = a.Slug,
                MainImage = a.MainImage,
                BasePrice = a.BasePrice,
                Selled = a.Selled,
                ViewCount = a.ViewCount,
                RatingCount = a.RatingCount,
                AverageRating = a.AverageRating,
                Category = new FeaturedAccessoryCategoryDto
                {
                    Id = a.Category.Id,
                    Name = a.Category.Name,
                },
                Brand = new FeaturedAccessoryBrandDto { Id = a.Brand.Id, Name = a.Brand.Name },
            })
            .ToListAsync(cancellationToken);

        return items;
    }
}
