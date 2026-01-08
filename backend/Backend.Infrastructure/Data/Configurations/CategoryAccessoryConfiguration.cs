using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class CategoryAccessoryConfiguration : IEntityTypeConfiguration<CategoryAccessory>
{
    public void Configure(EntityTypeBuilder<CategoryAccessory> builder)
    {
        builder.ToTable("category_accessories");

        builder.HasKey(ca => ca.Id);

        // Properties
        builder.Property(ca => ca.Name).IsRequired().HasMaxLength(255);

        builder.Property(ca => ca.Slug).IsRequired().HasMaxLength(300);

        builder.Property(ca => ca.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(ca => ca.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(ca => ca.Slug).IsUnique();

        // Indexes
        builder.HasIndex(ca => ca.Name);

        // Relationships
        builder
            .HasMany(ca => ca.Brands)
            .WithOne(b => b.Category)
            .HasForeignKey(b => b.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(ca => ca.Accessories)
            .WithOne(a => a.Category)
            .HasForeignKey(a => a.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
