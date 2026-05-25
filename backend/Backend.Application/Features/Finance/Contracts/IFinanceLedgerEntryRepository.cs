public interface IFinanceLedgerEntryRepository : IGenericRepository<FinanceLedgerEntry>
{
    Task<bool> ExistsBySourceAsync(
        FinanceEntrySourceType sourceType,
        int sourceId,
        CancellationToken cancellationToken = default
    );
}
