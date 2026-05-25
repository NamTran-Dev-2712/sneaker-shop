using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class StaffProfileConfiguration : IEntityTypeConfiguration<StaffProfile>
{
    public void Configure(EntityTypeBuilder<StaffProfile> builder)
    {
        builder.ToTable("staff_profiles");

        builder.HasKey(sp => sp.Id);

        // Properties
        builder.Property(sp => sp.AccountId).IsRequired();

        builder.Property(sp => sp.StoreId).IsRequired();

        builder.Property(sp => sp.FullName).HasMaxLength(255);

        builder.Property(sp => sp.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(sp => sp.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(sp => sp.AccountId).IsUnique();

        // Indexes
        builder.HasIndex(sp => sp.StoreId);
        builder.HasIndex(sp => sp.FullName);

        // Relationships defined in Account and Store configurations
    }
}
