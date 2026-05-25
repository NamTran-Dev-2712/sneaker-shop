public record ResendVerificationEmailResult
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
}
