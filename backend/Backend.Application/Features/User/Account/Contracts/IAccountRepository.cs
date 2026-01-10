public interface IAccountRepository
{
    Task<Account?> GetAccountByIdAsync(int accountId);
}
