using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class VendorPriceConfiguration : IEntityTypeConfiguration<VendorPrice>
{
    public void Configure(EntityTypeBuilder<VendorPrice> builder)
    {
        builder.ToTable("vendor_prices");

        builder.HasKey(vp => vp.Id);

        // Properties
        builder.Property(vp => vp.VendorId).IsRequired();

        builder.Property(vp => vp.SellableItemId).IsRequired();

        builder.Property(vp => vp.Price).IsRequired().HasPrecision(18, 2);

        builder.Property(vp => vp.EffectiveFrom).IsRequired();

        builder.Property(vp => vp.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(vp => vp.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints - price history tracking
        builder
            .HasIndex(vp => new
            {
                vp.VendorId,
                vp.SellableItemId,
                vp.EffectiveFrom,
            })
            .IsUnique();

        // Indexes for performance
        builder.HasIndex(vp => vp.VendorId);
        builder.HasIndex(vp => vp.SellableItemId);
        builder.HasIndex(vp => vp.EffectiveFrom);
        builder.HasIndex(vp => vp.EffectiveTo);

        // Composite index for price queries
        builder.HasIndex(vp => new
        {
            vp.VendorId,
            vp.SellableItemId,
            vp.EffectiveFrom,
            vp.EffectiveTo,
        });
    }
}
