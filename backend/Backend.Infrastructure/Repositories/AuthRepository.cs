public class AuthRepository : IAuthRepository
{
    private readonly IUnitOfWork _unitOfWork;

    public AuthRepository(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> IsEmailExistsAsync(string email)
    {
        if (string.IsNullOrEmpty(email))
        {
            return false;
        }

        bool existEmail = await _unitOfWork
            .Repository<Account>()
            .ExistsAsync(a => a.Email != null && a.Email.ToLower() == email.ToLower());

        return existEmail;
    }

    public async Task<bool> IsPhoneNumberExistsAsync(string phoneNumber)
    {
        bool existPhone = await _unitOfWork
            .Repository<Account>()
            .ExistsAsync(a => a.Phone.ToLower() == phoneNumber.ToLower());

        return existPhone;
    }

    public async Task<Customer?> FindCustomerByPhoneAsync(string phone)
    {
        return await _unitOfWork
            .Repository<Customer>()
            .GetFirstOrDefaultAsync(c => c.Phone.ToLower() == phone.ToLower());
    }

    public async Task<Account> CreateAccountAsync(Account account)
    {
        await _unitOfWork.Repository<Account>().AddAsync(account);
        return account;
    }

    public async Task LinkAccountToCustomerAsync(Account account, Customer customer)
    {
        account.LinkToCustomer(customer.Id);

        if (account.CustomerAccount != null)
        {
            await _unitOfWork.Repository<CustomerAccount>().AddAsync(account.CustomerAccount);
        }
    }

    public async Task CreateCustomerWithAccountAsync(Customer customer, Account account)
    {
        // Create customer first
        await _unitOfWork.Repository<Customer>().AddAsync(customer);

        // Link account to customer using object reference (not ID)
        // EF Core will automatically track the relationship
        account.LinkToCustomer(customer);

        if (account.CustomerAccount != null)
        {
            await _unitOfWork.Repository<CustomerAccount>().AddAsync(account.CustomerAccount);
        }
    }

    public async Task<Account?> GetAccountByEmailOrPhoneAsync(string emailOrPhone)
    {
        if (string.IsNullOrEmpty(emailOrPhone))
        {
            return null;
        }

        var normalizedInput = emailOrPhone.ToLower();

        // Try to find by email first
        var account = await _unitOfWork
            .Repository<Account>()
            .GetFirstOrDefaultAsync(
                a =>
                    (a.Email != null && a.Email.ToLower() == normalizedInput)
                    || a.Phone.ToLower() == normalizedInput,
                a => a.CustomerAccount!
            );

        return account;
    }
}
