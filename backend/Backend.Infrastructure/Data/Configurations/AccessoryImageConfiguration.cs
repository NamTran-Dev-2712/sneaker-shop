using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class AccessoryImageConfiguration : IEntityTypeConfiguration<AccessoryImage>
{
    public void Configure(EntityTypeBuilder<AccessoryImage> builder)
    {
        builder.ToTable("accessory_images");

        builder.HasKey(ai => ai.Id);

        // Properties
        builder.Property(ai => ai.AccessoryId).IsRequired();

        builder.Property(ai => ai.ImageUrl).IsRequired().HasMaxLength(500);

        builder.Property(ai => ai.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(ai => ai.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes
        builder.HasIndex(ai => ai.AccessoryId);
    }
}
