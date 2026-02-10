using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class SlideConfiguration : IEntityTypeConfiguration<Slide>
{
    public void Configure(EntityTypeBuilder<Slide> builder)
    {
        builder.ToTable("slides");

        builder.HasKey(s => s.Id);

        // Properties
        builder.Property(s => s.Title).IsRequired().HasMaxLength(200);

        builder.Property(s => s.Subtitle).IsRequired().HasMaxLength(200);

        builder.Property(s => s.description).IsRequired().HasMaxLength(500);

        builder.Property(s => s.ImageUrl).IsRequired().HasMaxLength(500);

        builder.Property(s => s.ButtonText).IsRequired().HasMaxLength(50);

        builder.Property(s => s.ButtonUrl).IsRequired().HasMaxLength(500);

        builder.Property(s => s.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(s => s.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes for search
        builder.HasIndex(s => s.Title);
        builder.HasIndex(s => s.CreatedAt);
    }
}
