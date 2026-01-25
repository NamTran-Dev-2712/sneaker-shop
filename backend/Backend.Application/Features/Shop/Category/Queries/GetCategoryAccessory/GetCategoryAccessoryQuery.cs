using MediatR;

public class GetCategoryAccessoryQuery
    : BaseGetRequest,
        IRequest<BaseGetResponse<GetCategoryAccessoryResult>>
{
    public string SortBy { get; init; } = global::SortBy.NAME;
    public string SortOrder { get; init; } = global::SortOrder.ASC;
}
