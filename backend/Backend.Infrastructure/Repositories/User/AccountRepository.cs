public class AccountRepository : GenericRepository<Account>, IAccountRepository
{
    public AccountRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<Account?> GetAccountByIdAsync(int accountId)
    {
        return await GetFirstOrDefaultAsync(a => a.Id == accountId, a => a.CustomerAccount!);
    }
}
