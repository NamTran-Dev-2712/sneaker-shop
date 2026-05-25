using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class RestockRequestConfiguration : IEntityTypeConfiguration<RestockRequest>
{
    public void Configure(EntityTypeBuilder<RestockRequest> builder)
    {
        builder.ToTable("restock_requests");

        builder.HasKey(rr => rr.Id);

        // Properties
        builder.Property(rr => rr.StoreId).IsRequired();

        builder.Property(rr => rr.SellableItemId).IsRequired();

        builder.Property(rr => rr.SuggestedQty).IsRequired();

        builder.Property(rr => rr.Reason).HasMaxLength(1000);

        builder.Property(rr => rr.Status).HasConversion<string>().IsRequired().HasMaxLength(20);

        builder.Property(rr => rr.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(rr => rr.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes for performance
        builder.HasIndex(rr => rr.StoreId);
        builder.HasIndex(rr => rr.SellableItemId);
        builder.HasIndex(rr => rr.Status);
        builder.HasIndex(rr => rr.CreatedBy);
        builder.HasIndex(rr => rr.CreatedAt);

        // Composite indexes for common queries
        builder.HasIndex(rr => new { rr.Status, rr.CreatedAt });
        builder.HasIndex(rr => new { rr.StoreId, rr.Status });
    }
}
