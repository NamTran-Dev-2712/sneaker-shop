using MediatR;

public class GetBrandQuery : BaseGetRequest, IRequest<BaseGetResponse<GetBrandResult>>
{
    public bool? IsActive { get; init; }
    public string SortBy { get; init; } = global::SortBy.NAME;
    public string SortOrder { get; init; } = global::SortOrder.ASC;
}
