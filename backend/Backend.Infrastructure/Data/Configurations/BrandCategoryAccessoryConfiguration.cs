using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class BrandCategoryAccessoryConfiguration : IEntityTypeConfiguration<BrandCategoryAccessory>
{
    public void Configure(EntityTypeBuilder<BrandCategoryAccessory> builder)
    {
        builder.ToTable("brand_category_accessories");

        builder.HasKey(bca => bca.Id);

        // Properties
        builder.Property(bca => bca.CategoryId).IsRequired();

        builder.Property(bca => bca.Name).IsRequired().HasMaxLength(255);

        builder.Property(bca => bca.Slug).IsRequired().HasMaxLength(300);

        builder.Property(bca => bca.ThumbnailUrl).IsRequired().HasMaxLength(500);

        builder.Property(bca => bca.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(bca => bca.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(bca => new { bca.CategoryId, bca.Slug }).IsUnique();

        // Indexes
        builder.HasIndex(bca => bca.CategoryId);
        builder.HasIndex(bca => bca.Slug);

        // Relationships
        builder
            .HasMany(bca => bca.Accessories)
            .WithOne(a => a.Brand)
            .HasForeignKey(a => a.BrandId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
