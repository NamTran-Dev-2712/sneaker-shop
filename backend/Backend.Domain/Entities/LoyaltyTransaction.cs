public class LoyaltyTransaction : BaseEntity
{
    public LoyaltyTransaction() { }

    public int LoyaltyAccountId { get; set; }
    public LoyaltyTxnType TxnType { get; set; }
    public long Points { get; set; } // + earn, - redeem
    public string? Reason { get; set; }
    public int? OrderId { get; set; }
    public int? CreatedBy { get; set; }

    // Navigation properties
    public LoyaltyAccount LoyaltyAccount { get; set; } = null!;
    public Order? Order { get; set; }
    public Account? Creator { get; set; }

    // Business logic
    public static LoyaltyTransaction CreateEarn(
        int loyaltyAccountId,
        long points,
        string? reason,
        int? orderId,
        int? createdBy
    )
    {
        return new LoyaltyTransaction
        {
            LoyaltyAccountId = loyaltyAccountId,
            TxnType = LoyaltyTxnType.EARN,
            Points = Math.Abs(points),
            Reason = reason,
            OrderId = orderId,
            CreatedBy = createdBy,
        };
    }

    public static LoyaltyTransaction CreateRedeem(
        int loyaltyAccountId,
        long points,
        string? reason,
        int? orderId,
        int? createdBy
    )
    {
        return new LoyaltyTransaction
        {
            LoyaltyAccountId = loyaltyAccountId,
            TxnType = LoyaltyTxnType.REDEEM,
            Points = -Math.Abs(points),
            Reason = reason,
            OrderId = orderId,
            CreatedBy = createdBy,
        };
    }

    public static LoyaltyTransaction CreateAdjust(
        int loyaltyAccountId,
        long pointsDelta,
        string? reason,
        int? createdBy
    )
    {
        return new LoyaltyTransaction
        {
            LoyaltyAccountId = loyaltyAccountId,
            TxnType = LoyaltyTxnType.ADJUST,
            Points = pointsDelta,
            Reason = reason,
            CreatedBy = createdBy,
        };
    }

    public static LoyaltyTransaction CreateExpire(
        int loyaltyAccountId,
        long points,
        string? reason,
        int? createdBy
    )
    {
        return new LoyaltyTransaction
        {
            LoyaltyAccountId = loyaltyAccountId,
            TxnType = LoyaltyTxnType.EXPIRE,
            Points = -Math.Abs(points),
            Reason = reason,
            CreatedBy = createdBy,
        };
    }
}
