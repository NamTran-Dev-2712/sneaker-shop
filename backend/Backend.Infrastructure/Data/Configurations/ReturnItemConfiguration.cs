using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ReturnItemConfiguration : IEntityTypeConfiguration<ReturnItem>
{
    public void Configure(EntityTypeBuilder<ReturnItem> builder)
    {
        builder.ToTable("return_items");

        builder.HasKey(ri => ri.Id);

        // Properties
        builder.Property(ri => ri.ReturnId).IsRequired();

        builder.Property(ri => ri.SellableItemId).IsRequired();

        builder.Property(ri => ri.Quantity).IsRequired();

        builder.Property(ri => ri.Condition).HasMaxLength(50);

        builder.Property(ri => ri.RefundAmount).IsRequired().HasPrecision(18, 2).HasDefaultValue(0);

        builder.Property(ri => ri.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(ri => ri.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes
        builder.HasIndex(ri => ri.ReturnId);
        builder.HasIndex(ri => ri.SellableItemId);
    }
}
