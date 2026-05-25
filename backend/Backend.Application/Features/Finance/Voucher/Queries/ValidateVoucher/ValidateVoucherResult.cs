public record ValidateVoucherResult
{
    public required string VoucherCode { get; init; }
    public required string DiscountType { get; init; }
    public required decimal DiscountValue { get; init; }
    public required decimal DiscountAmount { get; init; }
    public required string Message { get; init; }
}
