public record ProcessVnPayReturnResult
{
    public int? OrderId { get; init; }
    public required string VnPayTxnRef { get; init; }
    public required string Status { get; init; }
    public string? PaymentStatus { get; init; }
    public required string Message { get; init; }
}
