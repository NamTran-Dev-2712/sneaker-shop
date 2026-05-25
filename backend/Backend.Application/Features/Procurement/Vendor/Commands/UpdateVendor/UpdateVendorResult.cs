public record UpdateVendorResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Phone { get; init; }
    public required string Email { get; init; }
    public string? Address { get; init; }
    public required bool IsActive { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
