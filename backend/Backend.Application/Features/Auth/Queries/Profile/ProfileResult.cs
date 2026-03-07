public record ProfileResult
{
    public required int AccountId { get; init; }
    public int? CustomerId { get; init; }
    public required string Email { get; init; }
    public required bool IsEmailVerified { get; init; }
    public required string Phone { get; init; }
    public required string FullName { get; init; }
    public string? Avatar { get; init; }
    public string? Birthday { get; init; }
    public required Role Role { get; init; }
    public int CartItemCount { get; init; }
    public StaffProfileInfo? StaffProfile { get; init; }
}

public record StaffProfileInfo
{
    public required int StaffId { get; init; }
    public required int StoreId { get; init; }
    public required string StoreName { get; init; }
    public required string StoreCode { get; init; }
    public string? StoreAddress { get; init; }
    public string? StorePhone { get; init; }
}
