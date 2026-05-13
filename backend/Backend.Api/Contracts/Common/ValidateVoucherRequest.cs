public record ValidateVoucherRequest
{
    public required string Code { get; init; }
    public required decimal Subtotal { get; init; }
}
