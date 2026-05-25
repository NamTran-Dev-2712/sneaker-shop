public class ExternalAuthProvider : BaseEntity
{
    public ExternalAuthProvider() { }

    public int AccountId { get; set; }
    public AuthProvider Provider { get; set; }
    public string ProviderUserId { get; set; } = string.Empty;
    public string? Email { get; set; }

    // Navigation property
    public Account Account { get; set; } = null!;

    // Factory method
    public static ExternalAuthProvider Create(
        int accountId,
        AuthProvider provider,
        string providerUserId,
        string? email
    )
    {
        if (string.IsNullOrWhiteSpace(providerUserId))
        {
            throw new ArgumentException("Provider user ID is required.", nameof(providerUserId));
        }

        return new ExternalAuthProvider
        {
            AccountId = accountId,
            Provider = provider,
            ProviderUserId = providerUserId,
            Email = email,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
    }

    public static ExternalAuthProvider Create(
        Account account,
        AuthProvider provider,
        string providerUserId,
        string? email
    )
    {
        if (account == null)
        {
            throw new ArgumentNullException(nameof(account));
        }

        if (string.IsNullOrWhiteSpace(providerUserId))
        {
            throw new ArgumentException("Provider user ID is required.", nameof(providerUserId));
        }

        return new ExternalAuthProvider
        {
            Account = account,
            Provider = provider,
            ProviderUserId = providerUserId,
            Email = email,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
    }
}
