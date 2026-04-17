using MediatR;

public class GetMyLoyaltyTransactionsQuery
    : BaseGetRequest,
        IRequest<BaseGetResponse<GetMyLoyaltyTransactionsResult>>
{
    public int CustomerId { get; set; }
}
