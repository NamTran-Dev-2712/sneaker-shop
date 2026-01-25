using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ColorConfiguration : IEntityTypeConfiguration<Color>
{
    public void Configure(EntityTypeBuilder<Color> builder)
    {
        builder.ToTable("colors");

        builder.HasKey(c => c.Id);

        // Properties
        builder.Property(c => c.Name).IsRequired().HasMaxLength(100);

        builder.Property(c => c.Slug).IsRequired().HasMaxLength(150);

        builder.Property(c => c.Hex).IsRequired().HasMaxLength(7);

        builder.Property(c => c.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(c => c.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(c => c.Slug).IsUnique();

        // Indexes
        builder.HasIndex(c => c.Name);

        // Relationships
        builder
            .HasMany(c => c.SneakerColorways)
            .WithOne(sc => sc.Color)
            .HasForeignKey(sc => sc.ColorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
