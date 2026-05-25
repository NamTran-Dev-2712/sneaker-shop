public class FinanceLedgerEntry : BaseEntity
{
    public FinanceEntryStatus Status { get; set; }
    public decimal Amount { get; set; }
    public string Category { get; set; } = "GENERAL";
    public string? Description { get; set; }
    public FinanceEntrySourceType SourceType { get; set; } = FinanceEntrySourceType.MANUAL;
    public int? SourceId { get; set; }
    public int? StoreId { get; set; }
    public int? CreatedBy { get; set; }
    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
    public string? MetadataJson { get; set; }

    // Navigation properties
    public Store? Store { get; set; }
    public Account? Creator { get; set; }
}
