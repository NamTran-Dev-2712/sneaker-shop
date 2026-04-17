public class LoyaltyAccountRepository : GenericRepository<LoyaltyAccount>, ILoyaltyAccountRepository
{
    public LoyaltyAccountRepository(ApplicationDbContext context)
        : base(context) { }
}
