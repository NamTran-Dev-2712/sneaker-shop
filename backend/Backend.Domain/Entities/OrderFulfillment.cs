public class OrderFulfillment : BaseEntity
{
    public OrderFulfillment() { }

    public int OrderId { get; set; }
    public FulfillmentType Type { get; set; }
    public int? PickupStoreId { get; set; }
    public DateTime? PickupExpiresAt { get; set; } // Click & collect timeout
    public string? RecipientName { get; set; }
    public string? RecipientPhone { get; set; }
    public string? Address { get; set; }
    public string? Carrier { get; set; }
    public string? TrackingCode { get; set; }

    // Navigation properties
    public Order Order { get; set; } = null!;
    public Store? PickupStore { get; set; }

    // Business logic
    public void UpdateDeliveryInfo(string recipientName, string recipientPhone, string address)
    {
        RecipientName = recipientName;
        RecipientPhone = recipientPhone;
        Address = address;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdatePickupInfo(int pickupStoreId, DateTime? pickupExpiresAt)
    {
        PickupStoreId = pickupStoreId;
        PickupExpiresAt = pickupExpiresAt;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateShippingInfo(string carrier, string trackingCode)
    {
        Carrier = carrier;
        TrackingCode = trackingCode;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsPickupExpired()
    {
        return Type == FulfillmentType.PICKUP
            && PickupExpiresAt.HasValue
            && DateTime.UtcNow > PickupExpiresAt.Value;
    }
}
