using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("payments");

        builder.HasKey(p => p.Id);

        // Properties
        builder.Property(p => p.OrderId).IsRequired();

        builder.Property(p => p.Method).HasConversion<string>().IsRequired().HasMaxLength(20);

        builder.Property(p => p.Status).HasConversion<string>().IsRequired().HasMaxLength(20);

        builder.Property(p => p.Amount).IsRequired().HasPrecision(18, 2);

        builder.Property(p => p.Provider).HasMaxLength(100);

        builder.Property(p => p.ProviderTxnId).HasMaxLength(255);

        builder.Property(p => p.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(p => p.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes
        builder.HasIndex(p => p.OrderId);
        builder.HasIndex(p => p.Method);
        builder.HasIndex(p => p.Status);
        builder.HasIndex(p => p.ProviderTxnId);
        builder.HasIndex(p => p.PaidAt);

        // Composite index for payment reconciliation
        builder.HasIndex(p => new { p.Status, p.PaidAt });
    }
}
