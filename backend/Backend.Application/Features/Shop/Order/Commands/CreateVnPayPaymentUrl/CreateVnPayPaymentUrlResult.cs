public record CreateVnPayPaymentUrlResult
{
    public required int OrderId { get; init; }
    public required string PaymentUrl { get; init; }
    public required string TxnRef { get; init; }
}
