public record UpdateStoreResult
{
    public required int Id { get; init; }
    public required string Code { get; init; }
    public required string Name { get; init; }
    public string? Address { get; init; }
    public string? Phone { get; init; }
    public required bool IsActive { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
