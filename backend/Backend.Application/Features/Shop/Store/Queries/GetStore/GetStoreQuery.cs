using MediatR;

public class GetStoreQuery : BaseGetRequest, IRequest<BaseGetResponse<GetStoreResult>>
{
    public bool? IsActive { get; init; }
    public string SortBy { get; init; } = global::SortBy.NAME;
    public string SortOrder { get; init; } = global::SortOrder.ASC;
}
