public record RefreshTokenResult
{
    public required string AccessToken { get; init; }
    public required string RefreshToken { get; init; }
}
