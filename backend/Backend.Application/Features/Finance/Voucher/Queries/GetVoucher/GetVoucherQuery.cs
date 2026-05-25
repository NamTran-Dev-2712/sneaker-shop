using MediatR;

public class GetVoucherQuery : BaseGetRequest, IRequest<BaseGetResponse<GetVoucherResult>>
{
    public string? Status { get; init; }
    public VoucherScope? Scope { get; init; }
    public DiscountType? DiscountType { get; init; }
    public string SortBy { get; init; } = global::SortBy.CREATED_AT;
    public string SortOrder { get; init; } = global::SortOrder.DESC;
}
