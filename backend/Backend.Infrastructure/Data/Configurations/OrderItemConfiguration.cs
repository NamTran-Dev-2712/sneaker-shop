using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.ToTable("order_items");

        builder.HasKey(oi => oi.Id);

        // Properties
        builder.Property(oi => oi.OrderId).IsRequired();

        builder.Property(oi => oi.SellableItemId).IsRequired();

        builder.Property(oi => oi.Quantity).IsRequired();

        builder.Property(oi => oi.UnitPrice).IsRequired().HasPrecision(18, 2);

        builder.Property(oi => oi.Discount).IsRequired().HasPrecision(18, 2).HasDefaultValue(0);

        builder.Property(oi => oi.LineTotal).IsRequired().HasPrecision(18, 2);

        builder.Property(oi => oi.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(oi => oi.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(oi => new { oi.OrderId, oi.SellableItemId }).IsUnique();

        // Indexes
        builder.HasIndex(oi => oi.OrderId);
        builder.HasIndex(oi => oi.SellableItemId);
    }
}
