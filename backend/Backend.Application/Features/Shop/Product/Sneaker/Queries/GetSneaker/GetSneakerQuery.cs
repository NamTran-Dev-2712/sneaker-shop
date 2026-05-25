using MediatR;

public class GetSneakerQuery : BaseGetRequest, IRequest<BaseGetResponse<GetSneakerResult>>
{
    public int? BrandId { get; init; }
    public int? BrandSeriesId { get; init; }
    public bool? IsActive { get; init; }
    public decimal? MinPrice { get; init; }
    public decimal? MaxPrice { get; init; }
    public List<int>? ColorIds { get; init; }
    public List<int>? SizeIds { get; init; }
    public string SortBy { get; init; } = global::SortBy.NAME;
    public string SortOrder { get; init; } = global::SortOrder.ASC;
}
