using MediatR;

public class GetSlideQuery : BaseGetRequest, IRequest<BaseGetResponse<GetSlideResult>>
{
    public string SortBy { get; init; } = global::SortBy.CREATED_AT;
    public string SortOrder { get; init; } = global::SortOrder.DESC;
}
