using Microsoft.EntityFrameworkCore;

public class ExternalAuthProviderRepository
    : GenericRepository<ExternalAuthProvider>,
        IExternalAuthProviderRepository
{
    public ExternalAuthProviderRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<ExternalAuthProvider?> GetByProviderAndUserIdAsync(
        AuthProvider provider,
        string providerUserId
    )
    {
        return await _context
            .ExternalAuthProviders.Include(e => e.Account)
                .ThenInclude(a => a.CustomerAccount)
            .FirstOrDefaultAsync(e => e.Provider == provider && e.ProviderUserId == providerUserId);
    }

    public async Task<Account?> FindAccountByEmailAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return null;

        return await _context
            .Accounts.Include(a => a.CustomerAccount)
            .FirstOrDefaultAsync(a => a.Email != null && a.Email.ToLower() == email.ToLower());
    }
}
