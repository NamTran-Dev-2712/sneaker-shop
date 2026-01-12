using System.Security.Claims;
using MediatR;

public class VerifyEmailCommandHandler : IRequestHandler<VerifyEmailCommand, VerifyEmailResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;

    public VerifyEmailCommandHandler(IUnitOfWork unitOfWork, ITokenService tokenService)
    {
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
    }

    public async Task<VerifyEmailResult> Handle(
        VerifyEmailCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Validate verification token
        var principal = _tokenService.ValidateEmailVerificationToken(command.Token);
        if (principal == null)
        {
            return new VerifyEmailResult
            {
                Success = false,
                Message =
                    "Invalid or expired verification token. Please request a new verification email.",
            };
        }

        // 2. Extract account ID and email from token
        var accountIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);
        var emailClaim = principal.FindFirst(ClaimTypes.Email);

        if (accountIdClaim == null || emailClaim == null)
        {
            return new VerifyEmailResult { Success = false, Message = "Invalid token format." };
        }

        if (!int.TryParse(accountIdClaim.Value, out int accountId))
        {
            return new VerifyEmailResult
            {
                Success = false,
                Message = "Invalid account ID in token.",
            };
        }

        // 3. Get account from database
        var account = await _unitOfWork.Accounts.GetAccountByIdAsync(accountId);
        if (account == null)
        {
            return new VerifyEmailResult { Success = false, Message = "Account not found." };
        }

        // 4. Check if already verified
        if (account.IsEmailVerified)
        {
            return new VerifyEmailResult
            {
                Success = true,
                Message = "Email already verified.",
                Email = account.Email,
            };
        }

        // 5. Verify email matches
        if (account.Email?.ToLower() != emailClaim.Value.ToLower())
        {
            return new VerifyEmailResult
            {
                Success = false,
                Message = "Email mismatch. Token does not match account email.",
            };
        }

        // 6. Mark email as verified
        account.VerifyEmail();

        // 7. Save changes
        await _unitOfWork.SaveChangesAsync();

        return new VerifyEmailResult
        {
            Success = true,
            Message = "Email verified successfully! You can now log in to your account.",
            Email = account.Email,
        };
    }
}
