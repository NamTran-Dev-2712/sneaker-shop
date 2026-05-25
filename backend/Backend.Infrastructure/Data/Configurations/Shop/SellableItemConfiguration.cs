using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class SellableItemConfiguration : IEntityTypeConfiguration<SellableItem>
{
    public void Configure(EntityTypeBuilder<SellableItem> builder)
    {
        builder.ToTable("sellable_items");

        builder.HasKey(si => si.Id);

        // Properties
        builder.Property(si => si.Type).HasConversion<string>().IsRequired().HasMaxLength(20);

        builder.Property(si => si.Sku).IsRequired().HasMaxLength(100);

        builder.Property(si => si.Barcode).HasMaxLength(100);

        builder.Property(si => si.RetailPrice).HasPrecision(18, 2);

        builder.Property(si => si.OnlinePrice).HasPrecision(18, 2);

        builder.Property(si => si.IsActive).IsRequired().HasDefaultValue(true);

        // Concurrency control for PostgreSQL
        // Use IsConcurrencyToken instead of IsRowVersion for PostgreSQL
        // IsRowVersion prevents EF Core from sending the value in INSERT statements
        builder
            .Property(si => si.RowVersion)
            .IsConcurrencyToken()
            .IsRequired()
            .HasColumnType("bytea");

        builder.Property(si => si.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(si => si.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(si => si.Sku).IsUnique();

        builder.HasIndex(si => si.Barcode).IsUnique().HasFilter("barcode IS NOT NULL");

        // Indexes for performance
        builder.HasIndex(si => si.Type);
        builder.HasIndex(si => si.IsActive);
        builder.HasIndex(si => si.SneakerVariantId);
        builder.HasIndex(si => si.AccessoryId);

        // Relationships
        builder
            .HasMany(si => si.VendorPrices)
            .WithOne(vp => vp.SellableItem)
            .HasForeignKey(vp => vp.SellableItemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(si => si.Inventories)
            .WithOne(i => i.SellableItem)
            .HasForeignKey(i => i.SellableItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasMany(si => si.PurchaseOrderItems)
            .WithOne(poi => poi.SellableItem)
            .HasForeignKey(poi => poi.SellableItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasMany(si => si.OrderItems)
            .WithOne(oi => oi.SellableItem)
            .HasForeignKey(oi => oi.SellableItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasMany(si => si.ReturnItems)
            .WithOne(ri => ri.SellableItem)
            .HasForeignKey(ri => ri.SellableItemId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasMany(si => si.CartItems)
            .WithOne(ci => ci.SellableItem)
            .HasForeignKey(ci => ci.SellableItemId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(si => si.RestockRequests)
            .WithOne(rr => rr.SellableItem)
            .HasForeignKey(rr => rr.SellableItemId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
