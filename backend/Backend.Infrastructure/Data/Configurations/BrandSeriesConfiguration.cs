using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class BrandSeriesConfiguration : IEntityTypeConfiguration<BrandSeries>
{
    public void Configure(EntityTypeBuilder<BrandSeries> builder)
    {
        builder.ToTable("brand_series");

        builder.HasKey(bs => bs.Id);

        // Properties
        builder.Property(bs => bs.BrandId).IsRequired();

        builder.Property(bs => bs.Name).IsRequired().HasMaxLength(255);

        builder.Property(bs => bs.Slug).IsRequired().HasMaxLength(300);

        builder.Property(bs => bs.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(bs => bs.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(bs => new { bs.BrandId, bs.Slug }).IsUnique();

        // Indexes
        builder.HasIndex(bs => bs.BrandId);
        builder.HasIndex(bs => bs.Slug);

        // Relationships
        builder
            .HasMany(bs => bs.Sneakers)
            .WithOne(s => s.BrandSeries)
            .HasForeignKey(s => s.BrandSeriesId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
