using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class LoyaltyTransactionConfiguration : IEntityTypeConfiguration<LoyaltyTransaction>
{
    public void Configure(EntityTypeBuilder<LoyaltyTransaction> builder)
    {
        builder.ToTable("loyalty_transactions");

        builder.HasKey(lt => lt.Id);

        // Properties
        builder.Property(lt => lt.LoyaltyAccountId).IsRequired();

        builder.Property(lt => lt.TxnType).HasConversion<string>().IsRequired().HasMaxLength(20);

        builder.Property(lt => lt.Points).IsRequired();

        builder.Property(lt => lt.Reason).HasMaxLength(500);

        builder.Property(lt => lt.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(lt => lt.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes for performance
        builder.HasIndex(lt => lt.LoyaltyAccountId);
        builder.HasIndex(lt => lt.TxnType);
        builder.HasIndex(lt => lt.OrderId);
        builder.HasIndex(lt => lt.CreatedBy);
        builder.HasIndex(lt => lt.CreatedAt);

        // Composite index for transaction history queries
        builder.HasIndex(lt => new { lt.LoyaltyAccountId, lt.CreatedAt });
    }
}
