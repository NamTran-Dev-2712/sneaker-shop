public record UpdateAvatarResult
{
    public required int AccountId { get; init; }
    public required string Avatar { get; init; }
    public DateTime UpdatedAt { get; init; }
}
