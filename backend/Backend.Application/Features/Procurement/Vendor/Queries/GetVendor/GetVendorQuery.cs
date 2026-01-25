using MediatR;

public class GetVendorQuery : BaseGetRequest, IRequest<BaseGetResponse<GetVendorResult>>
{
    public bool? IsActive { get; init; }
    public string SortBy { get; init; } = global::SortBy.NAME;
    public string SortOrder { get; init; } = global::SortOrder.ASC;
}
