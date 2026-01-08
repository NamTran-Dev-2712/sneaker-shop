using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class SizeConfiguration : IEntityTypeConfiguration<Size>
{
    public void Configure(EntityTypeBuilder<Size> builder)
    {
        builder.ToTable("sizes");

        builder.HasKey(s => s.Id);

        // Properties
        builder.Property(s => s.System).IsRequired().HasMaxLength(10);

        builder.Property(s => s.Value).IsRequired().HasPrecision(5, 2);

        builder.Property(s => s.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(s => s.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(s => new { s.System, s.Value }).IsUnique();

        // Indexes
        builder.HasIndex(s => s.System);
        builder.HasIndex(s => s.Value);

        // Relationships
        builder
            .HasMany(s => s.SneakerVariants)
            .WithOne(sv => sv.Size)
            .HasForeignKey(sv => sv.SizeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
