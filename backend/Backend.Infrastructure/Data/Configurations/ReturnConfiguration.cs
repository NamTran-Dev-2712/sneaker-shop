using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ReturnConfiguration : IEntityTypeConfiguration<Return>
{
    public void Configure(EntityTypeBuilder<Return> builder)
    {
        builder.ToTable("returns");

        builder.HasKey(r => r.Id);

        // Properties
        builder.Property(r => r.OrderId).IsRequired();

        builder.Property(r => r.Status).HasConversion<string>().IsRequired().HasMaxLength(20);

        builder.Property(r => r.Reason).HasMaxLength(1000);

        builder.Property(r => r.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(r => r.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes for performance
        builder.HasIndex(r => r.OrderId);
        builder.HasIndex(r => r.StoreId);
        builder.HasIndex(r => r.Status);
        builder.HasIndex(r => r.CreatedBy);
        builder.HasIndex(r => r.CreatedAt);

        // Composite index for return queries
        builder.HasIndex(r => new { r.Status, r.CreatedAt });

        // Relationships
        builder
            .HasMany(r => r.Items)
            .WithOne(ri => ri.Return)
            .HasForeignKey(ri => ri.ReturnId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
