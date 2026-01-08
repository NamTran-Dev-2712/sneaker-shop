using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class CustomerAccountConfiguration : IEntityTypeConfiguration<CustomerAccount>
{
    public void Configure(EntityTypeBuilder<CustomerAccount> builder)
    {
        builder.ToTable("customer_accounts");

        builder.HasKey(ca => ca.Id);

        // Properties
        builder.Property(ca => ca.AccountId).IsRequired();

        builder.Property(ca => ca.CustomerId).IsRequired();

        builder.Property(ca => ca.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(ca => ca.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints - both must be unique for 1-1 mapping
        builder.HasIndex(ca => ca.AccountId).IsUnique();

        builder.HasIndex(ca => ca.CustomerId).IsUnique();

        // Relationships defined in Account and Customer configurations
    }
}
