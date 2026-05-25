using MediatR;

public class GetCustomersQuery : BaseGetRequest, IRequest<BaseGetResponse<GetCustomersResult>>
{
    public bool? IsActive { get; init; }
    public bool? HasAccount { get; init; }
    public string SortBy { get; init; } = global::SortBy.CREATED_AT;
    public string SortOrder { get; init; } = global::SortOrder.DESC;
}
