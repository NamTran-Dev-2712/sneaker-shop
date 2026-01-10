public record LoginResult
{
    public required int AccountId { get; init; }
    public required string Email { get; init; }
    public required bool IsEmailVerified { get; init; }
    public required string Phone { get; init; }
    public required string FullName { get; init; }
    public string? Avatar { get; init; }
    public string? Birthday { get; init; }
    public required Role Role { get; init; }
    public required string AccessToken { get; init; }
    public required string RefreshToken { get; init; }
}
