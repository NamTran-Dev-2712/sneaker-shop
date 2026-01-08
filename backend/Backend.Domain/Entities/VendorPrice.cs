public class VendorPrice : BaseEntity
{
    public VendorPrice() { }

    public int VendorId { get; set; }
    public int SellableItemId { get; set; }
    public decimal Price { get; set; }
    public DateTime EffectiveFrom { get; set; }
    public DateTime? EffectiveTo { get; set; }

    // Navigation properties
    public Vendor Vendor { get; set; } = null!;
    public SellableItem SellableItem { get; set; } = null!;

    // Business logic: unique (vendor_id, sellable_item_id, effective_from)

    public bool IsEffectiveAt(DateTime date)
    {
        return date >= EffectiveFrom && (EffectiveTo == null || date <= EffectiveTo);
    }

    public void UpdatePrice(decimal newPrice)
    {
        Price = newPrice;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetEffectiveTo(DateTime effectiveTo)
    {
        EffectiveTo = effectiveTo;
        UpdatedAt = DateTime.UtcNow;
    }
}
