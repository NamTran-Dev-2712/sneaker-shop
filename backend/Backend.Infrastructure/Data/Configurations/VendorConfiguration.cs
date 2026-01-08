using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class VendorConfiguration : IEntityTypeConfiguration<Vendor>
{
    public void Configure(EntityTypeBuilder<Vendor> builder)
    {
        builder.ToTable("vendors");

        builder.HasKey(v => v.Id);

        // Properties
        builder.Property(v => v.Name).IsRequired().HasMaxLength(255);

        builder.Property(v => v.Phone).IsRequired().HasMaxLength(20);

        builder.Property(v => v.Email).IsRequired().HasMaxLength(255);

        builder.Property(v => v.Address).HasMaxLength(500);

        builder.Property(v => v.IsActive).IsRequired().HasDefaultValue(true);

        builder.Property(v => v.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(v => v.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(v => v.Email).IsUnique();
        builder.HasIndex(v => v.Phone).IsUnique();

        // Indexes
        builder.HasIndex(v => v.Name);
        builder.HasIndex(v => v.IsActive);
        builder.HasIndex(v => v.Email);

        // Relationships
        builder
            .HasMany(v => v.VendorPrices)
            .WithOne(vp => vp.Vendor)
            .HasForeignKey(vp => vp.VendorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(v => v.PurchaseOrders)
            .WithOne(po => po.Vendor)
            .HasForeignKey(po => po.VendorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
