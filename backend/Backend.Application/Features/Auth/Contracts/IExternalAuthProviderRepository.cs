public interface IExternalAuthProviderRepository : IGenericRepository<ExternalAuthProvider>
{
    Task<ExternalAuthProvider?> GetByProviderAndUserIdAsync(
        AuthProvider provider,
        string providerUserId
    );
    Task<Account?> FindAccountByEmailAsync(string email);
}
