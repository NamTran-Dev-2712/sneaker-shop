using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("customers");

        builder.HasKey(c => c.Id);

        // Properties
        builder.Property(c => c.Phone).HasMaxLength(20);

        builder.Property(c => c.Email).HasMaxLength(255);

        builder.Property(c => c.FullName).HasMaxLength(255);

        builder.Property(c => c.Birthday).HasMaxLength(50);

        builder.Property(c => c.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(c => c.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(c => c.Phone).IsUnique().HasFilter("phone IS NOT NULL");

        // Indexes
        builder.HasIndex(c => c.Email);
        builder.HasIndex(c => c.FullName);

        // Relationships
        builder
            .HasOne(c => c.CustomerAccount)
            .WithOne(ca => ca.Customer)
            .HasForeignKey<CustomerAccount>(ca => ca.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(c => c.LoyaltyAccount)
            .WithOne(la => la.Customer)
            .HasForeignKey<LoyaltyAccount>(la => la.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(c => c.Cart)
            .WithOne(cart => cart.Customer)
            .HasForeignKey<Cart>(cart => cart.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(c => c.Orders)
            .WithOne(o => o.Customer)
            .HasForeignKey(o => o.CustomerId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasMany(c => c.VoucherRedemptions)
            .WithOne(vr => vr.Customer)
            .HasForeignKey(vr => vr.CustomerId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
