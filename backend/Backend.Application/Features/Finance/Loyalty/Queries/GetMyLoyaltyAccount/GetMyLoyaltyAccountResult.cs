public record GetMyLoyaltyAccountResult
{
    public required long PointsBalance { get; init; }
    public required string Tier { get; init; }
}
