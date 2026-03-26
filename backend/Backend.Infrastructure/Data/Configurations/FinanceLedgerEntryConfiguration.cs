using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class FinanceLedgerEntryConfiguration : IEntityTypeConfiguration<FinanceLedgerEntry>
{
    public void Configure(EntityTypeBuilder<FinanceLedgerEntry> builder)
    {
        builder.ToTable("finance_ledger_entries");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Status).HasConversion<string>().IsRequired().HasMaxLength(20);

        builder.Property(x => x.Amount).IsRequired().HasPrecision(18, 2);

        builder.Property(x => x.Category).IsRequired().HasMaxLength(100).HasDefaultValue("GENERAL");

        builder.Property(x => x.Description).HasMaxLength(1000);

        builder.Property(x => x.SourceType).HasConversion<string>().IsRequired().HasMaxLength(30);

        builder.Property(x => x.OccurredAt).IsRequired();

        builder.Property(x => x.MetadataJson).HasColumnType("jsonb");

        builder.Property(x => x.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(x => x.UpdatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Indexes for reporting
        builder.HasIndex(x => x.StoreId);
        builder.HasIndex(x => x.Status);
        builder.HasIndex(x => x.OccurredAt);
        builder.HasIndex(x => new { x.StoreId, x.OccurredAt });
        builder.HasIndex(x => new { x.Status, x.OccurredAt });
        builder.HasIndex(x => x.SourceType);

        // Ensure auto-generated source events are idempotent
        builder
            .HasIndex(x => new { x.SourceType, x.SourceId })
            .IsUnique()
            .HasFilter("source_id IS NOT NULL");

        builder
            .HasOne(x => x.Store)
            .WithMany()
            .HasForeignKey(x => x.StoreId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasOne(x => x.Creator)
            .WithMany()
            .HasForeignKey(x => x.CreatedBy)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
