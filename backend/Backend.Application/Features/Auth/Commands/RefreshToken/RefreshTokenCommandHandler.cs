using System.Security.Claims;
using MediatR;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, RefreshTokenResult>
{
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    public RefreshTokenCommandHandler(ITokenService tokenService, IUnitOfWork unitOfWork)
    {
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
    }

    public async Task<RefreshTokenResult> Handle(
        RefreshTokenCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Validate refresh token
        var principal = _tokenService.ValidateRefreshToken(command.RefreshToken);
        if (principal == null)
        {
            throw new UnauthorizedException("Refresh token không hợp lệ hoặc đã hết hạn.");
        }

        // 2. Get AccountId from claims
        var accountIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (
            string.IsNullOrEmpty(accountIdClaim) || !int.TryParse(accountIdClaim, out var accountId)
        )
        {
            throw new UnauthorizedException("Token không chứa thông tin tài khoản hợp lệ.");
        }

        // 3. Verify account exists and is active
        var account = await _unitOfWork.Accounts.GetAccountByIdAsync(accountId);
        if (account == null)
        {
            throw new UnauthorizedException("Tài khoản không tồn tại.");
        }

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

        // 5. Build new claims
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

        // 6. Generate new tokens
        var newAccessToken = _tokenService.GenerateAccessToken(claims);
        var newRefreshToken = _tokenService.GenerateRefreshToken(claims);

        return new RefreshTokenResult
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
        };
    }
}
