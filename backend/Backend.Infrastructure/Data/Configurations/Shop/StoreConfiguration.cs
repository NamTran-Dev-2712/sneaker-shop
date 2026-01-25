using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class StoreConfiguration : IEntityTypeConfiguration<Store>
{
    public void Configure(EntityTypeBuilder<Store> builder)
    {
        builder.ToTable("stores");

        builder.HasKey(s => s.Id);

        // Properties
        builder.Property(s => s.Code).IsRequired().HasMaxLength(50);

        builder.Property(s => s.Name).IsRequired().HasMaxLength(255);

        builder.Property(s => s.Address).HasMaxLength(500);

        builder.Property(s => s.Phone).HasMaxLength(20);

        builder.Property(s => s.IsActive).IsRequired().HasDefaultValue(true);
        builder.Property(s => s.IsDeleted).IsRequired().HasDefaultValue(false);

        builder.Property(s => s.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(s => s.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(s => s.Code).IsUnique();

        // Indexes
        builder.HasIndex(s => s.IsActive);
        builder.HasIndex(s => s.Name);

        // Relationships
        builder
            .HasMany(s => s.StaffProfiles)
            .WithOne(sp => sp.Store)
            .HasForeignKey(sp => sp.StoreId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasMany(s => s.Inventories)
            .WithOne(i => i.Store)
            .HasForeignKey(i => i.StoreId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasMany(s => s.Orders)
            .WithOne(o => o.Store)
            .HasForeignKey(o => o.StoreId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasMany(s => s.PurchaseOrders)
            .WithOne(po => po.Store)
            .HasForeignKey(po => po.StoreId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasMany(s => s.Returns)
            .WithOne(r => r.Store)
            .HasForeignKey(r => r.StoreId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasMany(s => s.RestockRequests)
            .WithOne(rr => rr.Store)
            .HasForeignKey(rr => rr.StoreId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasMany(s => s.PickupOrders)
            .WithOne(of => of.PickupStore)
            .HasForeignKey(of => of.PickupStoreId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
