public class Account : BaseEntity
{
    public Account() { }

    public Role Role { get; set; } = Role.CUSTOMER;
    public string Email { get; set; } = string.Empty;
    public bool IsEmailVerified { get; set; } = false;
    public string Phone { get; set; } = string.Empty;
    public string? Password { get; set; }
    public string? Avatar { get; set; }
    public string? PublicIdAvatar { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public StaffProfile? StaffProfile { get; set; }
    public AdminProfile? AdminProfile { get; set; }
    public CustomerAccount? CustomerAccount { get; set; }
    public ICollection<Order> CreatedOrders { get; set; } = new List<Order>();
    public ICollection<Order> ProcessedOrders { get; set; } = new List<Order>();
    public ICollection<LoyaltyTransaction> LoyaltyTransactions { get; set; } =
        new List<LoyaltyTransaction>();
    public ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new List<PurchaseOrder>();
    public ICollection<Return> Returns { get; set; } = new List<Return>();
    public ICollection<RestockRequest> RestockRequests { get; set; } = new List<RestockRequest>();

    private Account(string phone, string email, string? passwordHash)
    {
        Phone = phone;
        Email = email;
        Password = passwordHash;
    }

    // Business logic
    public static Account Create(string phone, string email, string? passwordHash)
    {
        // check required fields
        if (string.IsNullOrWhiteSpace(phone))
        {
            throw new ArgumentException("Phone number is required to create an account.");
        }
        if (string.IsNullOrWhiteSpace(passwordHash))
        {
            throw new ArgumentException("Password hash is required to create an account.");
        }
        if (string.IsNullOrWhiteSpace(email) && string.IsNullOrWhiteSpace(phone))
        {
            throw new ArgumentException("Either email or phone number must be provided.");
        }

        return new Account(phone, email, passwordHash);
    }

    public void LinkToCustomer(int customerId)
    {
        if (CustomerAccount != null)
        {
            throw new InvalidOperationException("Account is already linked to a customer.");
        }

        CustomerAccount = new CustomerAccount { AccountId = Id, CustomerId = customerId };

        UpdatedAt = DateTime.UtcNow;
    }

    // Overload for new customers (without ID yet)
    public void LinkToCustomer(Customer customer)
    {
        if (CustomerAccount != null)
        {
            throw new InvalidOperationException("Account is already linked to a customer.");
        }

        CustomerAccount = new CustomerAccount { Account = this, Customer = customer };

        UpdatedAt = DateTime.UtcNow;
    }

    public void VerifyEmail()
    {
        IsEmailVerified = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdatePassword(string newPasswordHash)
    {
        Password = newPasswordHash;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateProfile(string email, string phone, string? avatar, string? publicIdAvatar)
    {
        Email = email;
        Phone = phone;
        Avatar = avatar;
        PublicIdAvatar = publicIdAvatar;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool HasEmailOrPhone()
    {
        return !string.IsNullOrWhiteSpace(Email) || !string.IsNullOrWhiteSpace(Phone);
    }

    public bool CanLogin()
    {
        return IsActive && HasEmailOrPhone() && !string.IsNullOrWhiteSpace(Password);
    }
}
