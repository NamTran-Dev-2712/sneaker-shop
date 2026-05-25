using MediatR;

public class GetColorQuery : BaseGetRequest, IRequest<BaseGetResponse<GetColorResult>>
{
    public string SortBy { get; init; } = global::SortBy.NAME;
    public string SortOrder { get; init; } = global::SortOrder.ASC;
}
