using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
{
    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.ToTable("cart_items");

        builder.HasKey(ci => ci.Id);

        // Properties
        builder.Property(ci => ci.CartId).IsRequired();

        builder.Property(ci => ci.SellableItemId).IsRequired();

        builder.Property(ci => ci.Quantity).IsRequired();

        builder.Property(ci => ci.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(ci => ci.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(ci => new { ci.CartId, ci.SellableItemId }).IsUnique();

        // Indexes
        builder.HasIndex(ci => ci.CartId);
        builder.HasIndex(ci => ci.SellableItemId);
    }
}
