public record GetCustomerDetailResult
{
    public required int Id { get; init; }
    public required string FullName { get; init; }
    public string? Phone { get; init; }
    public string? Email { get; init; }
    public string? Birthday { get; init; }
    public DateTime CreatedAt { get; init; }

    // Account info
    public int? AccountId { get; init; }
    public bool HasAccount { get; init; }
    public bool IsActive { get; init; }
    public bool IsEmailVerified { get; init; }
    public string? Avatar { get; init; }

    // Stats
    public int TotalOrders { get; init; }
    public decimal TotalSpent { get; init; }
    public long LoyaltyPoints { get; init; }
    public string LoyaltyTier { get; init; } = "STANDARD";
}
