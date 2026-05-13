using MediatR;

public class CreateStaffCommandHandler : IRequestHandler<CreateStaffCommand, CreateStaffResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IAuthRepository _authRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IEmailJobQueue _emailJobQueue;

    public CreateStaffCommandHandler(
        IUnitOfWork unitOfWork,
        IAuthRepository authRepository,
        IPasswordHasher passwordHasher,
        IEmailJobQueue emailJobQueue
    )
    {
        _unitOfWork = unitOfWork;
        _authRepository = authRepository;
        _passwordHasher = passwordHasher;
        _emailJobQueue = emailJobQueue;
    }

    public async Task<CreateStaffResult> Handle(
        CreateStaffCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Check if email or phone already exists
        var existingByEmail = await _authRepository.GetAccountByEmailOrPhoneAsync(command.Email);
        if (existingByEmail != null)
        {
            throw new BadException("Email hoặc số điện thoại đã tồn tại.");
        }

        var existingByPhone = await _authRepository.GetAccountByEmailOrPhoneAsync(command.Phone);
        if (existingByPhone != null)
        {
            throw new BadException("Email hoặc số điện thoại đã tồn tại.");
        }

        // 2. Generate random password
        var rawPassword = GenerateRandomPassword(12);
        var passwordHash = _passwordHasher.HashPassword(rawPassword);

        // 3. Create Account with STAFF role (explicitly active)
        var account = Account.Create(
            phone: command.Phone.Trim(),
            email: command.Email.Trim().ToLower(),
            passwordHash: passwordHash
        );
        account.Role = Role.STAFF;
        account.IsEmailVerified = true;
        account.IsActive = true;

        await _unitOfWork.Repository<Account>().AddAsync(account, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 4. Create StaffProfile
        var staffProfile = new StaffProfile
        {
            AccountId = account.Id,
            StoreId = command.StoreId,
            FullName = command.FullName.Trim(),
        };

        await _unitOfWork.Staffs.AddAsync(staffProfile, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 5. Get store info for result
        var store = await _unitOfWork.Stores.GetByIdAsync(command.StoreId, cancellationToken);

        // 6. Enqueue credentials email via background job
        _emailJobQueue.EnqueueStaffCredentialsEmail(
            email: command.Email.Trim().ToLower(),
            fullName: command.FullName.Trim(),
            rawPassword: rawPassword,
            storeName: store?.Name ?? "N/A"
        );

        // 7. Return result
        return new CreateStaffResult
        {
            Id = staffProfile.Id,
            AccountId = account.Id,
            FullName = staffProfile.FullName ?? string.Empty,
            Email = account.Email,
            Phone = account.Phone,
            StoreId = staffProfile.StoreId,
            StoreName = store?.Name ?? string.Empty,
            StoreCode = store?.Code ?? string.Empty,
            IsActive = account.IsActive,
            CreatedAt = staffProfile.CreatedAt,
        };
    }

    private static string GenerateRandomPassword(int length)
    {
        const string upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const string lowerCase = "abcdefghijklmnopqrstuvwxyz";
        const string digits = "0123456789";
        const string special = "!@#$%&*";
        const string allChars = upperCase + lowerCase + digits + special;

        var random = new Random();
        var password = new char[length];

        // Ensure at least one of each type
        password[0] = upperCase[random.Next(upperCase.Length)];
        password[1] = lowerCase[random.Next(lowerCase.Length)];
        password[2] = digits[random.Next(digits.Length)];
        password[3] = special[random.Next(special.Length)];

        for (int i = 4; i < length; i++)
        {
            password[i] = allChars[random.Next(allChars.Length)];
        }

        // Shuffle the password
        for (int i = password.Length - 1; i > 0; i--)
        {
            int j = random.Next(i + 1);
            (password[i], password[j]) = (password[j], password[i]);
        }

        return new string(password);
    }
}
