using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class AccessoryConfiguration : IEntityTypeConfiguration<Accessory>
{
    public void Configure(EntityTypeBuilder<Accessory> builder)
    {
        builder.ToTable("accessories");

        builder.HasKey(a => a.Id);

        // Properties
        builder.Property(a => a.CategoryId).IsRequired();

        builder.Property(a => a.BrandId).IsRequired();

        builder.Property(a => a.Name).IsRequired().HasMaxLength(255);

        builder.Property(a => a.Slug).IsRequired().HasMaxLength(300);

        builder.Property(a => a.Description).HasMaxLength(2000);

        builder.Property(a => a.MainImage).IsRequired().HasMaxLength(500);

        builder.Property(a => a.BasePrice).HasPrecision(18, 2);

        builder.Property(a => a.IsDeleted).IsRequired().HasDefaultValue(false);
        builder.Property(a => a.Selled).IsRequired().HasDefaultValue(0);
        builder.Property(a => a.ViewCount).IsRequired().HasDefaultValue(0);
        builder.Property(a => a.RatingCount).IsRequired().HasDefaultValue(0);
        builder.Property(a => a.AverageRating).IsRequired().HasDefaultValue(0);

        builder.Property(a => a.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(a => a.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(a => a.Slug).IsUnique().HasFilter("slug IS NOT NULL");

        // Indexes
        builder.HasIndex(a => a.CategoryId);
        builder.HasIndex(a => a.BrandId);
        builder.HasIndex(a => a.Name);
        builder.HasIndex(a => a.IsDeleted);

        // Relationships
        builder
            .HasMany(a => a.Images)
            .WithOne(ai => ai.Accessory)
            .HasForeignKey(ai => ai.AccessoryId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(a => a.SellableItem)
            .WithOne(si => si.Accessory)
            .HasForeignKey<SellableItem>(si => si.AccessoryId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
