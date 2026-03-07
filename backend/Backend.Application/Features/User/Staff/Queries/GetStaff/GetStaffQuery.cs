using MediatR;

public class GetStaffQuery : BaseGetRequest, IRequest<BaseGetResponse<GetStaffResult>>
{
    public int? StoreId { get; init; }
    public bool? IsActive { get; init; }
    public string SortBy { get; init; } = global::SortBy.NAME;
    public string SortOrder { get; init; } = global::SortOrder.ASC;
}
