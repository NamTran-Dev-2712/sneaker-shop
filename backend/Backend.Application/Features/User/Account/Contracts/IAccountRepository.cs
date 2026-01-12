public interface IAccountRepository : IGenericRepository<Account>
{
    Task<Account?> GetAccountByIdAsync(int accountId);
}
