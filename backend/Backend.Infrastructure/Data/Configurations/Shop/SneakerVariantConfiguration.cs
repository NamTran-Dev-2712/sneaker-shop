using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class SneakerVariantConfiguration : IEntityTypeConfiguration<SneakerVariant>
{
    public void Configure(EntityTypeBuilder<SneakerVariant> builder)
    {
        builder.ToTable("sneaker_variants");

        builder.HasKey(sv => sv.Id);

        // Properties
        builder.Property(sv => sv.SneakerId).IsRequired();

        builder.Property(sv => sv.ColorwayId).IsRequired();

        builder.Property(sv => sv.SizeId).IsRequired();

        builder.Property(sv => sv.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(sv => sv.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints - important for business logic
        builder
            .HasIndex(sv => new
            {
                sv.SneakerId,
                sv.ColorwayId,
                sv.SizeId,
            })
            .IsUnique();

        // Indexes for performance
        builder.HasIndex(sv => sv.SneakerId);
        builder.HasIndex(sv => sv.ColorwayId);
        builder.HasIndex(sv => sv.SizeId);

        // Relationships
        builder
            .HasOne(sv => sv.SellableItem)
            .WithOne(si => si.SneakerVariant)
            .HasForeignKey<SellableItem>(si => si.SneakerVariantId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
