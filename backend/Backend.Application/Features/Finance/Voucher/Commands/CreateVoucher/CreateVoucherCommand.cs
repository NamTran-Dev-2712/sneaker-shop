using MediatR;

public record CreateVoucherCommand : IRequest<CreateVoucherResult>
{
    public required string Code { get; init; }
    public required DiscountType DiscountType { get; init; }
    public required decimal DiscountValue { get; init; }
    public decimal? MaxDiscount { get; init; }
    public decimal? MinOrderTotal { get; init; }
    public required VoucherScope Scope { get; init; }
    public int? UsageLimit { get; init; }
    public int? UsagePerCustomer { get; init; }
    public DateTime? StartsAt { get; init; }
    public DateTime? EndsAt { get; init; }
    public bool IsActive { get; init; } = true;
}
