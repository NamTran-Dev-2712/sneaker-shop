using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class AdminProfileConfiguration : IEntityTypeConfiguration<AdminProfile>
{
    public void Configure(EntityTypeBuilder<AdminProfile> builder)
    {
        builder.ToTable("admin_profiles");

        builder.HasKey(ap => ap.Id);

        // Properties
        builder.Property(ap => ap.AccountId).IsRequired();

        builder.Property(ap => ap.FullName).HasMaxLength(255);

        builder.Property(ap => ap.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(ap => ap.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(ap => ap.AccountId).IsUnique();

        // Relationships defined in Account configuration
    }
}
