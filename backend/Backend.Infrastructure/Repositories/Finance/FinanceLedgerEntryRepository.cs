using Microsoft.EntityFrameworkCore;

public class FinanceLedgerEntryRepository
    : GenericRepository<FinanceLedgerEntry>,
        IFinanceLedgerEntryRepository
{
    public FinanceLedgerEntryRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<bool> ExistsBySourceAsync(
        FinanceEntrySourceType sourceType,
        int sourceId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Set<FinanceLedgerEntry>()
            .AnyAsync(
                x => x.SourceType == sourceType && x.SourceId.HasValue && x.SourceId == sourceId,
                cancellationToken
            );
    }
}
