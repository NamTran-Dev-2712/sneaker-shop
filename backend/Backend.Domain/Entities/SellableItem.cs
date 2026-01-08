public class SellableItem : BaseEntity
{
    public SellableItem() { }

    public SellableType Type { get; set; }
    public int? SneakerVariantId { get; set; }
    public int? AccessoryId { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string? Barcode { get; set; }
    public decimal? RetailPrice { get; set; }
    public decimal? OnlinePrice { get; set; }
    public bool IsActive { get; set; } = true;
    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    // Navigation properties
    public SneakerVariant? SneakerVariant { get; set; }
    public Accessory? Accessory { get; set; }
    public ICollection<VendorPrice> VendorPrices { get; set; } = new List<VendorPrice>();
    public ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();
    public ICollection<PurchaseOrderItem> PurchaseOrderItems { get; set; } =
        new List<PurchaseOrderItem>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<ReturnItem> ReturnItems { get; set; } = new List<ReturnItem>();
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public ICollection<RestockRequest> RestockRequests { get; set; } = new List<RestockRequest>();

    // Business logic
    // Rule: type=SNEAKER_VARIANT => sneaker_variant_id not null, accessory_id null
    //       type=ACCESSORY       => accessory_id not null, sneaker_variant_id null

    public void ValidateTypeConsistency()
    {
        if (
            Type == SellableType.SNEAKER_VARIANT
            && (SneakerVariantId == null || AccessoryId != null)
        )
            throw new InvalidOperationException(
                "SellableItem of type SNEAKER_VARIANT must have SneakerVariantId and AccessoryId must be null"
            );

        if (Type == SellableType.ACCESSORY && (AccessoryId == null || SneakerVariantId != null))
            throw new InvalidOperationException(
                "SellableItem of type ACCESSORY must have AccessoryId and SneakerVariantId must be null"
            );
    }

    public void UpdatePrices(decimal? retailPrice, decimal? onlinePrice)
    {
        RetailPrice = retailPrice;
        OnlinePrice = onlinePrice;
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

    public decimal GetEffectivePrice(SalesChannel channel)
    {
        return channel == SalesChannel.ONLINE
            ? OnlinePrice ?? RetailPrice ?? 0
            : RetailPrice ?? OnlinePrice ?? 0;
    }
}
