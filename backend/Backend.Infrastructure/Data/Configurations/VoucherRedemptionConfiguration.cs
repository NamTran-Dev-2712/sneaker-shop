using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class VoucherRedemptionConfiguration : IEntityTypeConfiguration<VoucherRedemption>
{
    public void Configure(EntityTypeBuilder<VoucherRedemption> builder)
    {
        builder.ToTable("voucher_redemptions");

        builder.HasKey(vr => vr.Id);

        // Properties
        builder.Property(vr => vr.VoucherId).IsRequired();

        builder.Property(vr => vr.OrderId).IsRequired();

        builder.Property(vr => vr.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(vr => vr.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints - 1 order = 1 voucher
        builder.HasIndex(vr => vr.OrderId).IsUnique();

        // Indexes
        builder.HasIndex(vr => vr.VoucherId);
        builder.HasIndex(vr => vr.CustomerId);
        builder.HasIndex(vr => vr.RedeemedAt);

        // Composite index for voucher usage tracking
        builder.HasIndex(vr => new { vr.VoucherId, vr.CustomerId });
    }
}
