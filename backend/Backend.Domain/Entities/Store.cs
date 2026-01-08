public class Store : BaseEntity
{
    public Store() { }

    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<StaffProfile> StaffProfiles { get; set; } = new List<StaffProfile>();
    public ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new List<PurchaseOrder>();
    public ICollection<Return> Returns { get; set; } = new List<Return>();
    public ICollection<RestockRequest> RestockRequests { get; set; } = new List<RestockRequest>();
    public ICollection<OrderFulfillment> PickupOrders { get; set; } = new List<OrderFulfillment>();

    // Business logic
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

    public void UpdateInfo(string name, string? address, string? phone)
    {
        Name = name;
        Address = address;
        Phone = phone;
        UpdatedAt = DateTime.UtcNow;
    }
}
