public record GetStaffOrderDetailResult
{
    public required int OrderId { get; init; }
    public required string OrderCode { get; init; }
    public required string Status { get; init; }
    public required string Channel { get; init; }
    public string? Note { get; init; }
    public DateTime? PlacedAt { get; init; }

    // Store / Staff handling
    public int? StoreId { get; init; }
    public string? StoreName { get; init; }
    public int? StaffId { get; init; }
    public string? StaffName { get; init; }

    // Customer
    public string? CustomerName { get; init; }
    public string? CustomerPhone { get; init; }

    // Totals
    public decimal Subtotal { get; init; }
    public decimal DiscountTotal { get; init; }
    public decimal ShippingFee { get; init; }
    public decimal Total { get; init; }

    // Payment
    public string? PaymentMethod { get; init; }
    public string? PaymentStatus { get; init; }

    // Fulfillment
    public string? FulfillmentType { get; init; }
    public string? RecipientName { get; init; }
    public string? RecipientPhone { get; init; }
    public string? Address { get; init; }
    public int? PickupStoreId { get; init; }
    public string? PickupStoreName { get; init; }
    public string? Carrier { get; init; }
    public string? TrackingCode { get; init; }

    // Items
    public List<GetStaffOrderDetailItemResult> Items { get; init; } = new();
}

public record GetStaffOrderDetailItemResult
{
    public required int SellableItemId { get; init; }
    public required string ProductName { get; init; }
    public required string Sku { get; init; }
    public string? VariantName { get; init; }
    public int Quantity { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal Discount { get; init; }
    public decimal LineTotal { get; init; }
    public string? ImageUrl { get; init; }
}
