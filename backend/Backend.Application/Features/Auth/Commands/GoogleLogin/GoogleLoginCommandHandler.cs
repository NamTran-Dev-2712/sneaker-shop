using System.Security.Claims;
using MediatR;
using Microsoft.Extensions.Logging;

public class GoogleLoginCommandHandler : IRequestHandler<GoogleLoginCommand, GoogleLoginResult>
{
    private readonly IGoogleOAuthService _googleOAuthService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;
    private readonly ILogger<GoogleLoginCommandHandler> _logger;

    public GoogleLoginCommandHandler(
        IGoogleOAuthService googleOAuthService,
        IUnitOfWork unitOfWork,
        ITokenService tokenService,
        ILogger<GoogleLoginCommandHandler> logger
    )
    {
        _googleOAuthService = googleOAuthService;
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task<GoogleLoginResult> Handle(
        GoogleLoginCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Exchange authorization code for tokens
        var tokenResponse = await _googleOAuthService.ExchangeCodeForTokenAsync(
            command.Code,
            command.RedirectUri
        );

        // 2. Extract user info from ID token
        var googleUser = await _googleOAuthService.GetUserInfoFromIdTokenAsync(
            tokenResponse.IdToken
        );

        // 3. Validate email is verified
        if (!googleUser.EmailVerified)
        {
            throw new UnauthorizedException(
                "Email Google của bạn chưa được xác minh. Vui lòng xác minh email trước khi đăng nhập."
            );
        }

        // 4. Find or create user
        Account? account = null;
        Customer? customer = null;
        bool isNewUser = false;

        // 4a. Check if this Google user already linked to an account
        var existingProvider = await _unitOfWork.ExternalAuthProviders.GetByProviderAndUserIdAsync(
            AuthProvider.Google,
            googleUser.Sub
        );

        if (existingProvider != null)
        {
            // Existing Google user - load account
            account = existingProvider.Account;
            _logger.LogInformation(
                "Google login: Existing provider found for sub {Sub}, AccountId {AccountId}",
                googleUser.Sub,
                account.Id
            );
        }
        else
        {
            // 4b. Check if an account exists with the same email
            account = await _unitOfWork.ExternalAuthProviders.FindAccountByEmailAsync(
                googleUser.Email
            );

            if (account != null)
            {
                // Link Google to existing account
                var newProvider = ExternalAuthProvider.Create(
                    account.Id,
                    AuthProvider.Google,
                    googleUser.Sub,
                    googleUser.Email
                );
                await _unitOfWork.ExternalAuthProviders.AddAsync(newProvider, cancellationToken);

                // Mark email as verified since Google verified it
                if (!account.IsEmailVerified)
                {
                    account.MarkEmailAsVerified();
                    _unitOfWork.Repository<Account>().Update(account);
                }

                _logger.LogInformation(
                    "Google login: Linked provider to existing account {AccountId} for email {Email}",
                    account.Id,
                    googleUser.Email
                );
            }
            else
            {
                // 4c. Create new account + customer
                isNewUser = true;

                account = Account.CreateForExternalAuth(
                    email: googleUser.Email,
                    avatar: googleUser.Picture
                );

                await _unitOfWork.Repository<Account>().AddAsync(account, cancellationToken);

                // Create customer
                var fullName = googleUser.Name ?? googleUser.Email;
                customer = Customer.Create(
                    fullName: fullName,
                    phone: string.Empty,
                    email: googleUser.Email
                );

                await _unitOfWork.Repository<Customer>().AddAsync(customer, cancellationToken);

                // Link account to customer
                account.LinkToCustomer(customer);
                if (account.CustomerAccount != null)
                {
                    await _unitOfWork
                        .Repository<CustomerAccount>()
                        .AddAsync(account.CustomerAccount, cancellationToken);
                }

                // Create external auth provider
                var provider = ExternalAuthProvider.Create(
                    account.Id,
                    AuthProvider.Google,
                    googleUser.Sub,
                    googleUser.Email
                );
                await _unitOfWork.ExternalAuthProviders.AddAsync(provider, cancellationToken);

                _logger.LogInformation(
                    "Google login: Created new account for email {Email}",
                    googleUser.Email
                );
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        // 5. Check account is active
        if (!account.IsActive)
        {
            throw new UnauthorizedException(
                "Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ bộ phận hỗ trợ."
            );
        }

        // 6. Load customer info if not already loaded
        if (customer == null && account.CustomerAccount != null)
        {
            customer = await _unitOfWork.Customers.GetByIdAsync(account.CustomerAccount.CustomerId);
        }

        // 7. Get cart count
        int cartItemCount = 0;
        if (account.CustomerAccount != null)
        {
            var cart = await _unitOfWork.Carts.GetByCustomerIdWithItemsAsync(
                account.CustomerAccount.CustomerId,
                cancellationToken
            );
            cartItemCount = cart?.TotalCount ?? 0;
        }

        // 8. Build JWT claims (same structure as LoginCommandHandler)
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, account.Id.ToString()),
            new Claim(ClaimTypes.Email, account.Email ?? string.Empty),
            new Claim(ClaimTypes.MobilePhone, account.Phone ?? string.Empty),
            new Claim(ClaimTypes.Role, account.Role.ToString()),
            new Claim("IsEmailVerified", account.IsEmailVerified.ToString()),
        };

        if (customer != null)
        {
            claims.Add(new Claim("CustomerId", customer.Id.ToString()));
            if (!string.IsNullOrEmpty(customer.FullName))
            {
                claims.Add(new Claim(ClaimTypes.Name, customer.FullName));
            }
        }

        // 9. Generate tokens (reuse existing ITokenService)
        var accessToken = _tokenService.GenerateAccessToken(claims);
        var refreshToken = _tokenService.GenerateRefreshToken(claims);

        // 10. Return result
        return new GoogleLoginResult
        {
            AccountId = account.Id,
            CustomerId = customer?.Id,
            Email = account.Email ?? string.Empty,
            IsEmailVerified = account.IsEmailVerified,
            Phone = account.Phone ?? string.Empty,
            FullName = customer?.FullName ?? googleUser.Name ?? string.Empty,
            Avatar = account.Avatar,
            Birthday = customer?.Birthday,
            Role = account.Role,
            CartItemCount = cartItemCount,
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            IsNewUser = isNewUser,
        };
    }
}
