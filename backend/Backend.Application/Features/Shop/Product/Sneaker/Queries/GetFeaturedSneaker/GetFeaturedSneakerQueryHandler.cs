using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetFeaturedSneakerQueryHandler
    : IRequestHandler<GetFeaturedSneakerQuery, List<GetFeaturedSneakerResult>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetFeaturedSneakerQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<GetFeaturedSneakerResult>> Handle(
        GetFeaturedSneakerQuery query,
        CancellationToken cancellationToken
    )
    {
        // 1. Build base query - only active and not deleted sneakers
        var baseQuery = _unitOfWork
            .Sneakers.Query()
            .AsNoTracking()
            .Where(s => !s.IsDeleted && s.IsActive);

        // 2. Apply sorting based on FeaturedType
        baseQuery = query.FeaturedType switch
        {
            FeaturedType.TopRated => baseQuery
                .OrderByDescending(s => s.AverageRating)
                .ThenByDescending(s => s.RatingCount),
            FeaturedType.MostViewed => baseQuery.OrderByDescending(s => s.ViewCount),
            FeaturedType.BestSelling => baseQuery
                .OrderByDescending(s => s.Selled)
                .ThenByDescending(s => s.RatingCount),
            _ => baseQuery.OrderByDescending(s => s.Selled),
        };

        // 3. Take limit and project
        var items = await baseQuery
            .Take(query.Limit)
            .Select(s => new GetFeaturedSneakerResult
            {
                Id = s.Id,
                Name = s.Name,
                Slug = s.Slug,
                MainImage = s.MainImage,
                BasePrice = s.BasePrice,
                Selled = s.Selled,
                ViewCount = s.ViewCount,
                RatingCount = s.RatingCount,
                AverageRating = s.AverageRating,
                Brand = new FeaturedSneakerBrandDto { Id = s.Brand.Id, Name = s.Brand.Name },
                BrandSeries =
                    s.BrandSeries != null
                        ? new FeaturedSneakerBrandSeriesDto
                        {
                            Id = s.BrandSeries.Id,
                            Name = s.BrandSeries.Name,
                        }
                        : null,
            })
            .ToListAsync(cancellationToken);

        return items;
    }
}
