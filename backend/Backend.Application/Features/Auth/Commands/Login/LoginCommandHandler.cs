using System.Security.Claims;
using MediatR;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResult>
{
    private readonly IAuthRepository _authRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public LoginCommandHandler(
        IAuthRepository authRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        ITokenService tokenService
    )
    {
        _authRepository = authRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<LoginResult> Handle(LoginCommand command, CancellationToken cancellationToken)
    {
        // 1. Find account by email or phone
        var identifier = command.Email ?? command.Phone ?? string.Empty;
        var account = await _authRepository.GetAccountByEmailOrPhoneAsync(identifier);

        if (account == null)
        {
            throw new UnauthorizedException("Vui lòng kiểm tra lại thông tin đăng nhập.");
        }

        // 2. Verify password
        if (
            string.IsNullOrEmpty(account.Password)
            || !_passwordHasher.VerifyPassword(command.Password, account.Password)
        )
        {
            throw new UnauthorizedException("Vui lòng kiểm tra lại thông tin đăng nhập.");
        }

        // 3. Check if account is active
        if (!account.IsActive)
        {
            throw new UnauthorizedException(
                "Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ bộ phận hỗ trợ."
            );
        }

        // 4. Get customer information if linked
        Customer? customer = null;
        if (account.CustomerAccount != null)
        {
            customer = await _unitOfWork
                .Repository<Customer>()
                .GetByIdAsync(account.CustomerAccount.CustomerId);
        }

        // 5. Generate JWT claims
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, account.Id.ToString()),
            new Claim(ClaimTypes.Email, account.Email ?? string.Empty),
            new Claim(ClaimTypes.MobilePhone, account.Phone),
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

        // 6. Generate tokens
        var accessToken = _tokenService.GenerateAccessToken(claims);
        var refreshToken = _tokenService.GenerateRefreshToken(claims);

        // 7. Return result with tokens (will be set as cookies in controller)
        return new LoginResult
        {
            AccountId = account.Id,
            Email = account.Email ?? string.Empty,
            IsEmailVerified = account.IsEmailVerified,
            Phone = account.Phone,
            FullName = customer?.FullName ?? string.Empty,
            Avatar = account.Avatar,
            Birthday = customer?.Birthday,
            Role = account.Role,
            AccessToken = accessToken,
            RefreshToken = refreshToken,
        };
    }
}
