using MediatR;

public class GetMyOrdersQuery : BaseGetRequest, IRequest<BaseGetResponse<GetMyOrdersResult>>
{
    public required int CustomerId { get; set; }
    public string? Status { get; set; }
}
