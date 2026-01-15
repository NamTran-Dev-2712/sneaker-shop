using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class SneakerSubImageConfiguration : IEntityTypeConfiguration<SneakerSubImage>
{
    public void Configure(EntityTypeBuilder<SneakerSubImage> builder)
    {
        builder.ToTable("sneaker_sub_images");
        builder.HasKey(sv => sv.Id);

        // Properties
        builder.Property(sv => sv.SneakerId).IsRequired();

        builder.Property(sv => sv.ImageUrl).IsRequired().HasMaxLength(500);
        builder.Property(sv => sv.PublicId).IsRequired().HasMaxLength(500);

        builder.Property(sv => sv.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(sv => sv.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes for performance
        builder.HasIndex(sv => sv.SneakerId);

        // Relationships
        builder
            .HasOne(sv => sv.Sneaker)
            .WithMany(s => s.SneakerSubImages)
            .HasForeignKey(sv => sv.SneakerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
