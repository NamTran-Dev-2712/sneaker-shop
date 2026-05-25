public record RequestPasswordResetOtpResult
{
    public required string Message { get; init; }
    public int CooldownSeconds { get; init; }
}
