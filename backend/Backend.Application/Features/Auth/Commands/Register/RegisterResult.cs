public record RegisterResult
{
    public required int AccountId { get; init; }
    public required string Email { get; init; }
    public required Role Role { get; init; }
}
