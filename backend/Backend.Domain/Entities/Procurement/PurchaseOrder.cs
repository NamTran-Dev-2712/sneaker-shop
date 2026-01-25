public class PurchaseOrder : BaseEntity
{
    public PurchaseOrder() { }

    public int VendorId { get; set; }
    public int StoreId { get; set; } // Nhập về chi nhánh nào
    public PurchaseStatus Status { get; set; } = PurchaseStatus.CREATED;
    public DateTime? ExpectedAt { get; set; }
    public string? Note { get; set; }
    public int? CreatedBy { get; set; } // ADMIN

    // Navigation properties
    public Vendor Vendor { get; set; } = null!;
    public Store Store { get; set; } = null!;
    public Account? Creator { get; set; }
    public ICollection<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();

    // Business logic
    public void UpdateStatus(PurchaseStatus newStatus)
    {
        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsOrdered()
    {
        Status = PurchaseStatus.ORDERED;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsReceived()
    {
        Status = PurchaseStatus.RECEIVED;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Cancel()
    {
        Status = PurchaseStatus.CANCELLED;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool CanEdit()
    {
        return Status == PurchaseStatus.CREATED;
    }

    public bool CanCancel()
    {
        return Status == PurchaseStatus.CREATED || Status == PurchaseStatus.ORDERED;
    }

    public decimal GetTotalCost()
    {
        return Items.Sum(item => item.Quantity * item.UnitCost);
    }
}
