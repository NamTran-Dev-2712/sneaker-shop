using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class VoucherConfiguration : IEntityTypeConfiguration<Voucher>
{
    public void Configure(EntityTypeBuilder<Voucher> builder)
    {
        builder.ToTable("vouchers");

        builder.HasKey(v => v.Id);

        // Properties
        builder.Property(v => v.Code).IsRequired().HasMaxLength(50);

        builder.Property(v => v.DiscountType).HasConversion<string>().IsRequired().HasMaxLength(20);

        builder.Property(v => v.DiscountValue).IsRequired().HasPrecision(18, 2);

        builder.Property(v => v.MaxDiscount).HasPrecision(18, 2);

        builder.Property(v => v.MinOrderTotal).HasPrecision(18, 2);

        builder.Property(v => v.Scope).HasConversion<string>().IsRequired().HasMaxLength(20);

        builder.Property(v => v.IsActive).IsRequired().HasDefaultValue(true);

        builder.Property(v => v.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(v => v.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(v => v.Code).IsUnique();

        // Indexes for performance
        builder.HasIndex(v => v.IsActive);
        builder.HasIndex(v => v.StartsAt);
        builder.HasIndex(v => v.EndsAt);
        builder.HasIndex(v => v.Scope);

        // Composite index for active voucher queries
        builder.HasIndex(v => new
        {
            v.IsActive,
            v.StartsAt,
            v.EndsAt,
        });

        // Relationships
        builder
            .HasMany(v => v.Redemptions)
            .WithOne(vr => vr.Voucher)
            .HasForeignKey(vr => vr.VoucherId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
