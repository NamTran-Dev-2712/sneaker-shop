public record GetMyRedeemedVouchersResult
{
    public required string Code { get; init; }
    public required string DiscountType { get; init; }
    public required decimal DiscountValue { get; init; }
    public required decimal DiscountAmount { get; init; }
    public required int OrderId { get; init; }
    public required string OrderRef { get; init; }
    public DateTime? RedeemedAt { get; init; }
}
