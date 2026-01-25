public record DeleteVendorResult
{
    public required bool Success { get; init; }
    public required string Message { get; init; }
}
