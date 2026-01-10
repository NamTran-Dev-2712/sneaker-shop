public record VerifyEmailResult
{
    public required bool Success { get; init; }
    public required string Message { get; init; }
    public string? Email { get; init; }
}
