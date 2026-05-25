public class StaffProfile : BaseEntity
{
    public StaffProfile() { }

    public int AccountId { get; set; }
    public int StoreId { get; set; }
    public string? FullName { get; set; }

    // Navigation properties
    public Account Account { get; set; } = null!;
    public Store Store { get; set; } = null!;

    // Business logic
    public void UpdateInfo(string fullName)
    {
        FullName = fullName;
        UpdatedAt = DateTime.UtcNow;
    }

    public void TransferToStore(int newStoreId)
    {
        StoreId = newStoreId;
        UpdatedAt = DateTime.UtcNow;
    }
}
