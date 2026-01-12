public record UpdateProfileResult
{
    public required int AccountId { get; init; }
    public required string Email { get; init; }
    public required string Phone { get; init; }
    public string? Avatar { get; init; }
    public DateTime UpdatedAt { get; init; }
}
