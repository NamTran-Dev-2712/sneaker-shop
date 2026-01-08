public class Inventory : BaseEntity
{
    public Inventory() { }

    public int SellableItemId { get; set; }
    public int StoreId { get; set; }
    public int OnHand { get; set; } = 0; // Tổng sản phẩm đang có
    public int Reserved { get; set; } = 0; // Giữ chỗ (đơn hàng chưa thanh toán/đang xử lý)
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    // Available = OnHand - Reserved

    // Navigation properties
    public SellableItem SellableItem { get; set; } = null!;
    public Store Store { get; set; } = null!;

    // Business logic: unique (store_id, sellable_item_id)

    public int GetAvailable()
    {
        return OnHand - Reserved;
    }

    public bool CanReserve(int quantity)
    {
        return GetAvailable() >= quantity;
    }

    public void Reserve(int quantity)
    {
        if (!CanReserve(quantity))
            throw new InvalidOperationException(
                $"Insufficient available inventory. Available: {GetAvailable()}, Requested: {quantity}"
            );

        Reserved += quantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ReleaseReservation(int quantity)
    {
        if (Reserved < quantity)
            throw new InvalidOperationException(
                $"Cannot release more than reserved. Reserved: {Reserved}, Requested: {quantity}"
            );

        Reserved -= quantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddStock(int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(quantity));

        OnHand += quantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveStock(int quantity)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(quantity));

        if (OnHand < quantity)
            throw new InvalidOperationException(
                $"Insufficient on-hand inventory. OnHand: {OnHand}, Requested: {quantity}"
            );

        OnHand -= quantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void FulfillReservation(int quantity)
    {
        if (Reserved < quantity)
            throw new InvalidOperationException(
                $"Cannot fulfill more than reserved. Reserved: {Reserved}, Requested: {quantity}"
            );

        if (OnHand < quantity)
            throw new InvalidOperationException(
                $"Insufficient on-hand inventory. OnHand: {OnHand}, Requested: {quantity}"
            );

        Reserved -= quantity;
        OnHand -= quantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AdjustInventory(int onHandDelta, int reservedDelta = 0)
    {
        OnHand += onHandDelta;
        Reserved += reservedDelta;

        if (OnHand < 0)
            OnHand = 0;
        if (Reserved < 0)
            Reserved = 0;

        UpdatedAt = DateTime.UtcNow;
    }
}
