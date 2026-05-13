using MediatR;
using Microsoft.Extensions.Configuration;

public class ResendVerificationEmailCommandHandler
    : IRequestHandler<ResendVerificationEmailCommand, ResendVerificationEmailResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailJobQueue _emailJobQueue;
    private readonly ITokenService _tokenService;
    private readonly IConfiguration _configuration;

    public ResendVerificationEmailCommandHandler(
        IUnitOfWork unitOfWork,
        IEmailJobQueue emailJobQueue,
        ITokenService tokenService,
        IConfiguration configuration
    )
    {
        _unitOfWork = unitOfWork;
        _emailJobQueue = emailJobQueue;
        _tokenService = tokenService;
        _configuration = configuration;
    }

    public async Task<ResendVerificationEmailResult> Handle(
        ResendVerificationEmailCommand command,
        CancellationToken cancellationToken
    )
    {
        var account = await _unitOfWork.Accounts.GetAccountByIdAsync(command.AccountId);
        if (account == null)
        {
            return new ResendVerificationEmailResult
            {
                Success = false,
                Message = "Tài khoản không tồn tại.",
            };
        }

        if (account.IsEmailVerified)
        {
            return new ResendVerificationEmailResult
            {
                Success = false,
                Message = "Email đã được xác thực.",
            };
        }

        if (string.IsNullOrEmpty(account.Email))
        {
            return new ResendVerificationEmailResult
            {
                Success = false,
                Message = "Tài khoản chưa có địa chỉ email.",
            };
        }

        var verificationToken = _tokenService.GenerateEmailVerificationToken(
            account.Id,
            account.Email
        );
        var baseUrl = _configuration["AppSettings:BaseUrl"] ?? "http://localhost:5000";
        var verificationLink = $"{baseUrl}/api/auth/verify-email?token={verificationToken}";

        // Resolve customer name for email template
        var customerName =
            account.CustomerAccount?.Customer?.FullName
            ?? account.AdminProfile?.FullName
            ?? account.StaffProfile?.FullName
            ?? account.Email;

        _emailJobQueue.EnqueueVerificationEmail(account.Email, customerName, verificationLink);

        return new ResendVerificationEmailResult
        {
            Success = true,
            Message = "Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư.",
        };
    }
}
