using MediatR;
using Microsoft.Extensions.Configuration;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, RegisterResult>
{
    private readonly IAuthRepository _authRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IImageService _imageService;
    private readonly IMailSender _mailSender;
    private readonly ITokenService _tokenService;
    private readonly IConfiguration _configuration;

    public RegisterCommandHandler(
        IAuthRepository authRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        IImageService imageService,
        IMailSender mailSender,
        ITokenService tokenService,
        IConfiguration configuration
    )
    {
        _authRepository = authRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _imageService = imageService;
        _mailSender = mailSender;
        _tokenService = tokenService;
        _configuration = configuration;
    }

    public async Task<RegisterResult> Handle(
        RegisterCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Upload avatar if provided
        string? avatarUrl = null;
        if (command.Avatar != null)
        {
            avatarUrl = await _imageService.UploadImageAsync(
                command.Avatar,
                CloudinaryFolder.Avatars
            );
        }

        // 2. Create account entity with hashed password and avatar URL
        var passwordHash = _passwordHasher.HashPassword(command.Password);
        var account = Account.Create(
            phone: command.Phone ?? string.Empty,
            email: command.Email,
            passwordHash: passwordHash
        );

        // Set avatar URL if uploaded
        if (!string.IsNullOrEmpty(avatarUrl))
        {
            account.Avatar = avatarUrl;
        }

        await _authRepository.CreateAccountAsync(account);

        // 3. Find or create customer
        var existingCustomer = await _authRepository.FindCustomerByPhoneAsync(
            command.Phone ?? string.Empty
        );

        if (existingCustomer != null)
        {
            // Update existing customer info and link to account
            existingCustomer.UpdateInfo(command.Email, command.FullName, command.Birthday);
            await _authRepository.LinkAccountToCustomerAsync(account, existingCustomer);
        }
        else
        {
            // Create new customer and link to account
            var newCustomer = Customer.Create(
                fullName: command.FullName,
                phone: command.Phone ?? string.Empty,
                email: command.Email,
                birthday: command.Birthday
            );
            await _authRepository.CreateCustomerWithAccountAsync(newCustomer, account);
        }

        // 4. Persist all changes in single transaction
        await _unitOfWork.SaveChangesAsync();

        // 5. Send verification email (async, don't block response)
        if (!string.IsNullOrEmpty(account.Email))
        {
            _ = Task.Run(async () =>
            {
                try
                {
                    var verificationToken = _tokenService.GenerateEmailVerificationToken(
                        account.Id,
                        account.Email
                    );

                    var baseUrl = _configuration["AppSettings:BaseUrl"] ?? "http://localhost:5000";
                    var verificationLink =
                        $"{baseUrl}/api/auth/verify-email?token={verificationToken}";

                    await _mailSender.SendVerificationEmailAsync(
                        account.Email,
                        command.FullName,
                        verificationLink
                    );
                }
                catch (Exception e)
                {
                    // Log the exception (omitted for brevity)
                    throw new Exception($"Error sending verification email: {e.Message}", e);
                }
            });
        }

        // 6. Return result
        return new RegisterResult
        {
            AccountId = account.Id,
            Email = account.Email ?? string.Empty,
            Role = account.Role,
        };
    }
}
