using MediatR;

public class GetMyRedeemedVouchersQuery
    : BaseGetRequest,
        IRequest<BaseGetResponse<GetMyRedeemedVouchersResult>>
{
    public int CustomerId { get; set; }
}
