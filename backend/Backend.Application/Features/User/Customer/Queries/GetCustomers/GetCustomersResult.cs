public record GetCustomersResult
{
    public required int Id { get; init; }
    public required string FullName { get; init; }
    public string? Phone { get; init; }
    public string? Email { get; init; }
    public int? AccountId { get; init; }
    public bool HasAccount { get; init; }
    public bool IsActive { get; init; }
    public DateTime CreatedAt { get; init; }
}
