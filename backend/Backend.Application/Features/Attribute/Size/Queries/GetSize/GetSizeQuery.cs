using MediatR;

public class GetSizeQuery : BaseGetRequest, IRequest<BaseGetResponse<GetSizeResult>>
{
    public string? System { get; init; } // Filter by system: US, UK, EU, CM
    public string SortBy { get; init; } = "value";
    public string SortOrder { get; init; } = global::SortOrder.ASC;
}
