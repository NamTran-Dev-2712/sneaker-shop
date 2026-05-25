public class LoyaltyAccount : BaseEntity
{
    public LoyaltyAccount() { }

    public int CustomerId { get; set; }
    public long PointsBalance { get; set; } = 0;
    public string Tier { get; set; } = "STANDARD";

    // Navigation properties
    public Customer Customer { get; set; } = null!;
    public ICollection<LoyaltyTransaction> Transactions { get; set; } =
        new List<LoyaltyTransaction>();

    // Business logic
    public void EarnPoints(long points)
    {
        PointsBalance += points;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool CanRedeem(long points)
    {
        return PointsBalance >= points;
    }

    public void RedeemPoints(long points)
    {
        if (!CanRedeem(points))
            throw new InvalidOperationException("Insufficient points balance");

        PointsBalance -= points;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AdjustPoints(long pointsDelta)
    {
        PointsBalance += pointsDelta;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ExpirePoints(long points)
    {
        PointsBalance -= points;
        if (PointsBalance < 0)
            PointsBalance = 0;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateTier(string newTier)
    {
        Tier = newTier;
        UpdatedAt = DateTime.UtcNow;
    }
}
