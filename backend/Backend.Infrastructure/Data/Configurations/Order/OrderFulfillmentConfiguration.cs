using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class OrderFulfillmentConfiguration : IEntityTypeConfiguration<OrderFulfillment>
{
    public void Configure(EntityTypeBuilder<OrderFulfillment> builder)
    {
        builder.ToTable("order_fulfillments");

        builder.HasKey(of => of.Id);

        // Properties
        builder.Property(of => of.OrderId).IsRequired();

        builder.Property(of => of.Type).HasConversion<string>().IsRequired().HasMaxLength(20);

        builder.Property(of => of.RecipientName).HasMaxLength(255);

        builder.Property(of => of.RecipientPhone).HasMaxLength(20);

        builder.Property(of => of.Address).HasMaxLength(1000);

        builder.Property(of => of.Carrier).HasMaxLength(100);

        builder.Property(of => of.TrackingCode).HasMaxLength(100);

        builder.Property(of => of.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(of => of.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(of => of.OrderId).IsUnique();

        // Indexes
        builder.HasIndex(of => of.Type);
        builder.HasIndex(of => of.PickupStoreId);
        builder.HasIndex(of => of.TrackingCode);
        builder.HasIndex(of => of.PickupExpiresAt);
    }
}
