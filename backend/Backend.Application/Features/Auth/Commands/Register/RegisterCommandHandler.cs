using MediatR;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, RegisterResult>
{
    private readonly IAuthRepository _authRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;

    public RegisterCommandHandler(
        IAuthRepository authRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher
    )
    {
        _authRepository = authRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
    }

    public async Task<RegisterResult> Handle(
        RegisterCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Create account entity with hashed password
        var passwordHash = _passwordHasher.HashPassword(command.Password);
        var account = Account.Create(
            phone: command.Phone ?? string.Empty,
            email: command.Email,
            passwordHash: passwordHash
        );
        await _authRepository.CreateAccountAsync(account);

        // 2. Find or create customer
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

        // 3. Persist all changes in single transaction
        await _unitOfWork.SaveChangesAsync();

        return new RegisterResult
        {
            AccountId = account.Id,
            Email = account.Email ?? string.Empty,
            Role = account.Role,
        };
    }
}
