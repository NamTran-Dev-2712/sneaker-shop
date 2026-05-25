public class LoyaltyTransactionRepository
    : GenericRepository<LoyaltyTransaction>,
        ILoyaltyTransactionRepository
{
    public LoyaltyTransactionRepository(ApplicationDbContext context)
        : base(context) { }
}
