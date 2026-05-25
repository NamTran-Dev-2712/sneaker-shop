public record GetAvailableVouchersResult
{
    public required string Code { get; init; }
    public required string DiscountType { get; init; }
    public required decimal DiscountValue { get; init; }
    public decimal? MaxDiscount { get; init; }
    public decimal? MinOrderTotal { get; init; }
    public required decimal DiscountAmount { get; init; }
    public DateTime? EndsAt { get; init; }
}
