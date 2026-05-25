using MediatR;
using Microsoft.Extensions.Configuration;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, RegisterResult>
{
    private readonly IAuthRepository _authRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IImageService _imageService;
    private readonly IEmailJobQueue _emailJobQueue;
    private readonly ITokenService _tokenService;
    private readonly IConfiguration _configuration;

    public RegisterCommandHandler(
        IAuthRepository authRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher,
        IImageService imageService,
        IEmailJobQueue emailJobQueue,
        ITokenService tokenService,
        IConfiguration configuration
    )
    {
        _authRepository = authRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
        _imageService = imageService;
        _emailJobQueue = emailJobQueue;
        _tokenService = tokenService;
        _configuration = configuration;
    }

    public async Task<RegisterResult> Handle(
        RegisterCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Upload avatar if provided
        ImageUploadResult? avatarUpload = null;
        if (command.Avatar != null)
        {
            avatarUpload = await _imageService.UploadImageAsync(
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

        // Set avatar URL and PublicId if uploaded
        if (avatarUpload != null)
        {
            account.Avatar = avatarUpload.Url;
            account.PublicIdAvatar = avatarUpload.PublicId;
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

        // 5. Enqueue verification email via background job
        if (!string.IsNullOrEmpty(account.Email))
        {
            var verificationToken = _tokenService.GenerateEmailVerificationToken(
                account.Id,
                account.Email
            );
            var baseUrl = _configuration["AppSettings:BaseUrl"] ?? "http://localhost:5000";
            var verificationLink = $"{baseUrl}/api/auth/verify-email?token={verificationToken}";

            _emailJobQueue.EnqueueVerificationEmail(
                account.Email,
                command.FullName,
                verificationLink
            );
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
