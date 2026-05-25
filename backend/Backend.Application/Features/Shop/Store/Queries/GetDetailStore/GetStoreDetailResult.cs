public record GetStoreDetailResult
{
    public required int Id { get; init; }
    public required string Code { get; init; }
    public required string Name { get; init; }
    public string? Address { get; init; }
    public string? Phone { get; init; }
    public required bool IsActive { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
    public required int StaffCount { get; init; }
    public required int InventoryCount { get; init; }
    public required int OrderCount { get; init; }
}
