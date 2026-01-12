using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class AccountConfiguration : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.ToTable("accounts");

        builder.HasKey(a => a.Id);

        // Properties
        builder.Property(a => a.Role).HasConversion<string>().IsRequired().HasMaxLength(20);

        builder.Property(a => a.Email).IsRequired().HasMaxLength(255);

        builder.Property(a => a.Phone).HasMaxLength(20).IsRequired();

        builder.Property(a => a.Password).HasMaxLength(500);

        builder.Property(a => a.Avatar).HasMaxLength(500);
        builder.Property(a => a.PublicIdAvatar).HasMaxLength(500);

        builder.Property(a => a.IsEmailVerified).IsRequired().HasDefaultValue(false);

        builder.Property(a => a.IsActive).IsRequired().HasDefaultValue(true);

        builder.Property(a => a.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(a => a.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Unique constraints
        builder.HasIndex(a => a.Email).IsUnique().HasFilter("email IS NOT NULL");

        builder.HasIndex(a => a.Phone).IsUnique().HasFilter("phone IS NOT NULL");

        // Indexes for performance
        builder.HasIndex(a => a.Role);
        builder.HasIndex(a => a.IsActive);

        // Relationships
        builder
            .HasOne(a => a.StaffProfile)
            .WithOne(sp => sp.Account)
            .HasForeignKey<StaffProfile>(sp => sp.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(a => a.AdminProfile)
            .WithOne(ap => ap.Account)
            .HasForeignKey<AdminProfile>(ap => ap.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(a => a.CustomerAccount)
            .WithOne(ca => ca.Account)
            .HasForeignKey<CustomerAccount>(ca => ca.AccountId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(a => a.CreatedOrders)
            .WithOne(o => o.Creator)
            .HasForeignKey(o => o.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasMany(a => a.ProcessedOrders)
            .WithOne(o => o.Staff)
            .HasForeignKey(o => o.StaffId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasMany(a => a.LoyaltyTransactions)
            .WithOne(lt => lt.Creator)
            .HasForeignKey(lt => lt.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasMany(a => a.PurchaseOrders)
            .WithOne(po => po.Creator)
            .HasForeignKey(po => po.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasMany(a => a.Returns)
            .WithOne(r => r.Creator)
            .HasForeignKey(r => r.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasMany(a => a.RestockRequests)
            .WithOne(rr => rr.Creator)
            .HasForeignKey(rr => rr.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
