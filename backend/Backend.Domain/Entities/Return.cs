public class Return : BaseEntity
{
    public Return() { }

    public int OrderId { get; set; }
    public int? StoreId { get; set; } // Trả tại chi nhánh nào
    public ReturnStatus Status { get; set; } = ReturnStatus.REQUESTED;
    public string? Reason { get; set; }
    public int? CreatedBy { get; set; }

    // Navigation properties
    public Order Order { get; set; } = null!;
    public Store? Store { get; set; }
    public Account? Creator { get; set; }
    public ICollection<ReturnItem> Items { get; set; } = new List<ReturnItem>();

    // Business logic
    public void UpdateStatus(ReturnStatus newStatus)
    {
        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Approve()
    {
        Status = ReturnStatus.APPROVED;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Reject()
    {
        Status = ReturnStatus.REJECTED;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Complete()
    {
        Status = ReturnStatus.COMPLETED;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool CanEdit()
    {
        return Status == ReturnStatus.REQUESTED;
    }

    public bool CanApprove()
    {
        return Status == ReturnStatus.REQUESTED;
    }

    public decimal GetTotalRefundAmount()
    {
        return Items.Sum(item => item.RefundAmount);
    }
}
