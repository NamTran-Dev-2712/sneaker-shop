public class PasswordResetOtp : BaseEntity
{
    public PasswordResetOtp() { }

    public int AccountId { get; set; }
    public string EmailSnapshot { get; set; } = string.Empty;
    public string OtpHash { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public DateTime ResendAvailableAt { get; set; }
    public int AttemptCount { get; set; } = 0;
    public DateTime? ConsumedAt { get; set; }

    // Navigation properties
    public Account Account { get; set; } = null!;

    public static PasswordResetOtp Create(
        int accountId,
        string emailSnapshot,
        string otpHash,
        DateTime expiresAt,
        DateTime resendAvailableAt
    )
    {
        return new PasswordResetOtp
        {
            AccountId = accountId,
            EmailSnapshot = emailSnapshot,
            OtpHash = otpHash,
            ExpiresAt = expiresAt,
            ResendAvailableAt = resendAvailableAt,
            AttemptCount = 0,
            ConsumedAt = null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
    }

    public bool CanResend(DateTime utcNow) => utcNow >= ResendAvailableAt;

    public bool IsUsable(DateTime utcNow) => !ConsumedAt.HasValue && ExpiresAt > utcNow;

    public void MarkAttemptFailed()
    {
        AttemptCount++;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkConsumed()
    {
        if (ConsumedAt.HasValue)
        {
            return;
        }

        ConsumedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}
