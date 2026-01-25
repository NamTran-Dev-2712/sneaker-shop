public class AdminProfile : BaseEntity
{
    public AdminProfile() { }

    public int AccountId { get; set; }
    public string? FullName { get; set; }

    // Navigation properties
    public Account Account { get; set; } = null!;

    // Business logic
    public void UpdateInfo(string fullName)
    {
        FullName = fullName;
        UpdatedAt = DateTime.UtcNow;
    }
}
