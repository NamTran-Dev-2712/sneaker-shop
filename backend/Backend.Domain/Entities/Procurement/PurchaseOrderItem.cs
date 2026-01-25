public class PurchaseOrderItem : BaseEntity
{
    public PurchaseOrderItem() { }

    public int PurchaseOrderId { get; set; }
    public int SellableItemId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitCost { get; set; } // Giá vốn thực tế

    // Navigation properties
    public PurchaseOrder PurchaseOrder { get; set; } = null!;
    public SellableItem SellableItem { get; set; } = null!;

    // Business logic: unique (purchase_order_id, sellable_item_id)

    public decimal GetTotalCost()
    {
        return Quantity * UnitCost;
    }

    public void UpdateQuantity(int newQuantity)
    {
        if (newQuantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(newQuantity));

        Quantity = newQuantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateUnitCost(decimal newUnitCost)
    {
        if (newUnitCost < 0)
            throw new ArgumentException("Unit cost cannot be negative", nameof(newUnitCost));

        UnitCost = newUnitCost;
        UpdatedAt = DateTime.UtcNow;
    }
}
