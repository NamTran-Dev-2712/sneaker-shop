public interface IAuthRepository
{
    Task<bool> IsEmailExistsAsync(string email);
    Task<bool> IsPhoneNumberExistsAsync(string phoneNumber);
    Task<Customer?> FindCustomerByPhoneAsync(string phone);
    Task<Account> CreateAccountAsync(Account account);
    Task LinkAccountToCustomerAsync(Account account, Customer customer);
    Task CreateCustomerWithAccountAsync(Customer customer, Account account);
}
