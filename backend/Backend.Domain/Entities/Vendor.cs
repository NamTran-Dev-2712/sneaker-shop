public class Vendor : BaseEntity
{
    public Vendor() { }

    public string Name { get; set; } = string.Empty;
    public required string Phone { get; set; }
    public required string Email { get; set; }
    public string? Address { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<VendorPrice> VendorPrices { get; set; } = new List<VendorPrice>();
    public ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new List<PurchaseOrder>();

    // Business logic
    public void UpdateInfo(string name, string phone, string email, string? address)
    {
        Name = name;
        Phone = phone;
        Email = email;
        Address = address;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }
}
