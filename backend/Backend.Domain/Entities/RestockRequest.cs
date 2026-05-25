public class RestockRequest : BaseEntity
{
    public RestockRequest() { }

    public int StoreId { get; set; }
    public int SellableItemId { get; set; }
    public int SuggestedQty { get; set; }
    public string? Reason { get; set; }
    public RestockStatus Status { get; set; } = RestockStatus.OPEN;
    public int? CreatedBy { get; set; } // STAFF

    // Navigation properties
    public Store Store { get; set; } = null!;
    public SellableItem SellableItem { get; set; } = null!;
    public Account? Creator { get; set; }

    // Business logic
    public void UpdateStatus(RestockStatus newStatus)
    {
        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Approve()
    {
        Status = RestockStatus.APPROVED;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Reject()
    {
        Status = RestockStatus.REJECTED;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsDone()
    {
        Status = RestockStatus.DONE;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool CanEdit()
    {
        return Status == RestockStatus.OPEN;
    }

    public bool CanApprove()
    {
        return Status == RestockStatus.OPEN;
    }

    public void UpdateSuggestedQuantity(int newQuantity)
    {
        if (newQuantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(newQuantity));

        SuggestedQty = newQuantity;
        UpdatedAt = DateTime.UtcNow;
    }
}
