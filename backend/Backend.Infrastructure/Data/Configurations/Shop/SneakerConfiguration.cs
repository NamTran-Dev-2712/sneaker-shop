using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class SneakerConfiguration : IEntityTypeConfiguration<Sneaker>
{
    public void Configure(EntityTypeBuilder<Sneaker> builder)
    {
        builder.ToTable("sneakers");

        builder.HasKey(s => s.Id);

        // Properties
        builder.Property(s => s.BrandId).IsRequired();

        builder.Property(s => s.BrandSeriesId).IsRequired();

        builder.Property(s => s.Name).IsRequired().HasMaxLength(255);

        builder.Property(s => s.Slug).IsRequired().HasMaxLength(300);

        builder.Property(s => s.Description).HasMaxLength(2000);

        builder.Property(s => s.MainImage).IsRequired().HasMaxLength(500);
        builder.Property(s => s.PublicId).IsRequired().HasMaxLength(500);

        builder.Property(s => s.BasePrice).HasPrecision(18, 2);

        builder.Property(s => s.IsActive).IsRequired().HasDefaultValue(true);

        builder.Property(s => s.IsDeleted).IsRequired().HasDefaultValue(false);

        builder.Property(s => s.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(s => s.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(s => s.Slug).IsUnique();

        // Indexes for performance
        builder.HasIndex(s => s.BrandId);
        builder.HasIndex(s => s.BrandSeriesId);
        builder.HasIndex(s => s.Name);
        builder.HasIndex(s => s.IsActive);
        builder.HasIndex(s => s.IsDeleted);
        builder.HasIndex(s => new { s.IsActive, s.IsDeleted });

        // Relationships
        builder
            .HasMany(s => s.Colorways)
            .WithOne(sc => sc.Sneaker)
            .HasForeignKey(sc => sc.SneakerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(s => s.Variants)
            .WithOne(sv => sv.Sneaker)
            .HasForeignKey(sv => sv.SneakerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
