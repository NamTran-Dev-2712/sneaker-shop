public record GetStaffResult
{
    public required int Id { get; init; }
    public required int AccountId { get; init; }
    public required string FullName { get; init; }
    public required string Email { get; init; }
    public required string Phone { get; init; }
    public required int StoreId { get; init; }
    public required string StoreName { get; init; }
    public required string StoreCode { get; init; }
    public required bool IsActive { get; init; }
    public required DateTime CreatedAt { get; init; }
}
