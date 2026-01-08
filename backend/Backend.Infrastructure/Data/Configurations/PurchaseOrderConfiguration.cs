using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class PurchaseOrderConfiguration : IEntityTypeConfiguration<PurchaseOrder>
{
    public void Configure(EntityTypeBuilder<PurchaseOrder> builder)
    {
        builder.ToTable("purchase_orders");

        builder.HasKey(po => po.Id);

        // Properties
        builder.Property(po => po.VendorId).IsRequired();

        builder.Property(po => po.StoreId).IsRequired();

        builder.Property(po => po.Status).HasConversion<string>().IsRequired().HasMaxLength(20);

        builder.Property(po => po.Note).HasMaxLength(1000);

        builder.Property(po => po.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(po => po.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes for performance
        builder.HasIndex(po => po.VendorId);
        builder.HasIndex(po => po.StoreId);
        builder.HasIndex(po => po.Status);
        builder.HasIndex(po => po.CreatedBy);
        builder.HasIndex(po => po.ExpectedAt);
        builder.HasIndex(po => po.CreatedAt);

        // Composite indexes for common queries
        builder.HasIndex(po => new { po.Status, po.CreatedAt });
        builder.HasIndex(po => new { po.StoreId, po.Status });

        // Relationships
        builder
            .HasMany(po => po.Items)
            .WithOne(poi => poi.PurchaseOrder)
            .HasForeignKey(poi => poi.PurchaseOrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
