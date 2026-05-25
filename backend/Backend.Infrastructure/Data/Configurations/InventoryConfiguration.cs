using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class InventoryConfiguration : IEntityTypeConfiguration<Inventory>
{
    public void Configure(EntityTypeBuilder<Inventory> builder)
    {
        builder.ToTable("inventories");

        builder.HasKey(i => i.Id);

        // Properties
        builder.Property(i => i.SellableItemId).IsRequired();

        builder.Property(i => i.StoreId).IsRequired();

        builder.Property(i => i.OnHand).IsRequired().HasDefaultValue(0);

        builder.Property(i => i.Reserved).IsRequired().HasDefaultValue(0);

        // Concurrency control for PostgreSQL
        // Note: Must NOT use IsRowVersion() for PostgreSQL as it treats it as database-generated
        // We need to explicitly set the value in application code
        builder
            .Property(i => i.RowVersion)
            .IsRequired()
            .HasColumnType("bytea")
            .IsConcurrencyToken()
            .ValueGeneratedNever(); // Critical: tells EF Core we set the value manually

        builder.Property(i => i.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(i => i.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints - critical for inventory integrity
        builder.HasIndex(i => new { i.StoreId, i.SellableItemId }).IsUnique();

        // Indexes for performance
        builder.HasIndex(i => i.SellableItemId);
        builder.HasIndex(i => i.StoreId);
        builder.HasIndex(i => i.OnHand);
        builder.HasIndex(i => i.Reserved);

        // Composite index for available inventory queries
        builder.HasIndex(i => new
        {
            i.StoreId,
            i.OnHand,
            i.Reserved,
        });
    }
}
