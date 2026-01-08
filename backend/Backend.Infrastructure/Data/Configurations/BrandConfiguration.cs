using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class BrandConfiguration : IEntityTypeConfiguration<Brand>
{
    public void Configure(EntityTypeBuilder<Brand> builder)
    {
        builder.ToTable("brands");

        builder.HasKey(b => b.Id);

        // Properties
        builder.Property(b => b.Name).IsRequired().HasMaxLength(255);

        builder.Property(b => b.Slug).IsRequired().HasMaxLength(300);

        builder.Property(b => b.LogoUrl).IsRequired().HasMaxLength(500);

        builder.Property(b => b.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(b => b.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(b => b.Slug).IsUnique();

        // Indexes
        builder.HasIndex(b => b.Name);

        // Relationships
        builder
            .HasMany(b => b.BrandSeries)
            .WithOne(bs => bs.Brand)
            .HasForeignKey(bs => bs.BrandId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(b => b.Sneakers)
            .WithOne(s => s.Brand)
            .HasForeignKey(s => s.BrandId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
