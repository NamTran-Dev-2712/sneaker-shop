using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class PurchaseOrderItemConfiguration : IEntityTypeConfiguration<PurchaseOrderItem>
{
    public void Configure(EntityTypeBuilder<PurchaseOrderItem> builder)
    {
        builder.ToTable("purchase_order_items");

        builder.HasKey(poi => poi.Id);

        // Properties
        builder.Property(poi => poi.PurchaseOrderId).IsRequired();

        builder.Property(poi => poi.SellableItemId).IsRequired();

        builder.Property(poi => poi.Quantity).IsRequired();

        builder.Property(poi => poi.UnitCost).IsRequired().HasPrecision(18, 2);

        builder.Property(poi => poi.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(poi => poi.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(poi => new { poi.PurchaseOrderId, poi.SellableItemId }).IsUnique();

        // Indexes
        builder.HasIndex(poi => poi.PurchaseOrderId);
        builder.HasIndex(poi => poi.SellableItemId);
    }
}
