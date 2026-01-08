using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class SneakerColorwayConfiguration : IEntityTypeConfiguration<SneakerColorway>
{
    public void Configure(EntityTypeBuilder<SneakerColorway> builder)
    {
        builder.ToTable("sneaker_colorways");

        builder.HasKey(sc => sc.Id);

        // Properties
        builder.Property(sc => sc.SneakerId).IsRequired();

        builder.Property(sc => sc.ColorId).IsRequired();

        builder.Property(sc => sc.CoverImage).IsRequired().HasMaxLength(500);

        builder.Property(sc => sc.IsActive).IsRequired().HasDefaultValue(true);

        builder.Property(sc => sc.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(sc => sc.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(sc => new { sc.SneakerId, sc.ColorId }).IsUnique();

        // Indexes
        builder.HasIndex(sc => sc.SneakerId);
        builder.HasIndex(sc => sc.ColorId);
        builder.HasIndex(sc => sc.IsActive);

        // Relationships
        builder
            .HasMany(sc => sc.Variants)
            .WithOne(sv => sv.Colorway)
            .HasForeignKey(sv => sv.ColorwayId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
