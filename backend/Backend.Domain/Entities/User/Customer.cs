public class Customer : BaseEntity
{
    public Customer() { }

    public string? Phone { get; set; } // Key omnichannel (POS dùng phone)
    public string? Email { get; set; }
    public string? FullName { get; set; }
    public string? Birthday { get; set; }

    // Factory method
    public static Customer Create(
        string fullName,
        string phone,
        string? email = null,
        string? birthday = null
    )
    {
        if (string.IsNullOrWhiteSpace(phone))
        {
            throw new ArgumentException("Phone number is required.", nameof(phone));
        }

        return new Customer
        {
            Phone = phone.Trim(),
            Email = email,
            FullName = fullName,
            Birthday = birthday,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
    }

    // Factory method for external OAuth customers (Google, etc.)
    public static Customer CreateForExternalAuth(
        string fullName,
        string? email = null,
        string? birthday = null
    )
    {
        return new Customer
        {
            Phone = null,
            Email = email,
            FullName = fullName,
            Birthday = birthday,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
    }

    // Navigation properties
    public CustomerAccount? CustomerAccount { get; set; }
    public LoyaltyAccount? LoyaltyAccount { get; set; }
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<VoucherRedemption> VoucherRedemptions { get; set; } =
        new List<VoucherRedemption>();
    public Cart? Cart { get; set; }

    // Business logic
    public void UpdateInfo(string? email, string? fullName, string? birthday)
    {
        Email = email;
        FullName = fullName;
        Birthday = birthday;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdatePhone(string newPhone)
    {
        if (string.IsNullOrWhiteSpace(newPhone))
        {
            throw new ArgumentException("Phone number is required.", nameof(newPhone));
        }

        Phone = newPhone;
        UpdatedAt = DateTime.UtcNow;
    }
}
