using MediatR;

public class GetFeaturedSneakerQuery : IRequest<List<GetFeaturedSneakerResult>>
{
    public FeaturedType FeaturedType { get; init; } = FeaturedType.BestSelling;
    public int Limit { get; init; } = 8;
}

public enum FeaturedType
{
    TopRated, // Sort by AverageRating DESC
    MostViewed, // Sort by ViewCount DESC
    BestSelling, // Sort by Selled DESC, RatingCount DESC
}
