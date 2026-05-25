using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class LoyaltyAccountConfiguration : IEntityTypeConfiguration<LoyaltyAccount>
{
    public void Configure(EntityTypeBuilder<LoyaltyAccount> builder)
    {
        builder.ToTable("loyalty_accounts");

        builder.HasKey(la => la.Id);

        // Properties
        builder.Property(la => la.CustomerId).IsRequired();

        builder.Property(la => la.PointsBalance).IsRequired().HasDefaultValue(0);

        builder.Property(la => la.Tier).IsRequired().HasMaxLength(50).HasDefaultValue("STANDARD");

        builder.Property(la => la.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(la => la.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints - 1 customer = 1 loyalty account
        builder.HasIndex(la => la.CustomerId).IsUnique();

        // Indexes
        builder.HasIndex(la => la.Tier);
        builder.HasIndex(la => la.PointsBalance);

        // Relationships
        builder
            .HasMany(la => la.Transactions)
            .WithOne(lt => lt.LoyaltyAccount)
            .HasForeignKey(lt => lt.LoyaltyAccountId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
