using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("orders");

        builder.HasKey(o => o.Id);

        // Properties
        builder.Property(o => o.Channel).HasConversion<string>().IsRequired().HasMaxLength(20);

        builder.Property(o => o.Status).HasConversion<string>().IsRequired().HasMaxLength(20);

        builder.Property(o => o.Subtotal).IsRequired().HasPrecision(18, 2).HasDefaultValue(0);

        builder.Property(o => o.DiscountTotal).IsRequired().HasPrecision(18, 2).HasDefaultValue(0);

        builder.Property(o => o.ShippingFee).IsRequired().HasPrecision(18, 2).HasDefaultValue(0);

        builder.Property(o => o.Total).IsRequired().HasPrecision(18, 2).HasDefaultValue(0);

        builder.Property(o => o.RedeemedPoints).IsRequired().HasDefaultValue(0);

        builder.Property(o => o.RedeemedAmount).IsRequired().HasPrecision(18, 2).HasDefaultValue(0);

        builder.Property(o => o.Note).HasMaxLength(1000);

        builder.Property(o => o.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(o => o.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes for performance
        builder.HasIndex(o => o.Channel);
        builder.HasIndex(o => o.Status);
        builder.HasIndex(o => o.StoreId);
        builder.HasIndex(o => o.CustomerId);
        builder.HasIndex(o => o.CreatedBy);
        builder.HasIndex(o => o.StaffId);
        builder.HasIndex(o => o.PlacedAt);
        builder.HasIndex(o => o.CreatedAt);

        // Composite indexes for common queries
        builder.HasIndex(o => new { o.Status, o.CreatedAt });
        builder.HasIndex(o => new { o.CustomerId, o.Status });
        builder.HasIndex(o => new { o.StoreId, o.Status });

        // Relationships
        builder
            .HasMany(o => o.OrderItems)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(o => o.Payments)
            .WithOne(p => p.Order)
            .HasForeignKey(p => p.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(o => o.OrderFulfillment)
            .WithOne(of => of.Order)
            .HasForeignKey<OrderFulfillment>(of => of.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(o => o.VoucherRedemption)
            .WithOne(vr => vr.Order)
            .HasForeignKey<VoucherRedemption>(vr => vr.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(o => o.LoyaltyTransactions)
            .WithOne(lt => lt.Order)
            .HasForeignKey(lt => lt.OrderId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasMany(o => o.Returns)
            .WithOne(r => r.Order)
            .HasForeignKey(r => r.OrderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
