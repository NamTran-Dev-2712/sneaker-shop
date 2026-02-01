using MediatR;

public class GetFeaturedAccessoryQuery : IRequest<List<GetFeaturedAccessoryResult>>
{
    public FeaturedType FeaturedType { get; init; } = FeaturedType.BestSelling;
    public int Limit { get; init; } = 8;
}
