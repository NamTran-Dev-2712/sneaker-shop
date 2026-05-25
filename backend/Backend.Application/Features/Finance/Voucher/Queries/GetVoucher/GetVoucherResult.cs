public record GetVoucherResult
{
    public required int Id { get; init; }
    public required string Code { get; init; }
    public required string DiscountType { get; init; }
    public required decimal DiscountValue { get; init; }
    public decimal? MaxDiscount { get; init; }
    public decimal? MinOrderTotal { get; init; }
    public required string Scope { get; init; }
    public int? UsageLimit { get; init; }
    public int? UsagePerCustomer { get; init; }
    public required int UsageCount { get; init; }
    public DateTime? StartsAt { get; init; }
    public DateTime? EndsAt { get; init; }
    public required bool IsActive { get; init; }
    public required string ComputedStatus { get; init; }
    public required DateTime CreatedAt { get; init; }
}
