using MediatR;

public class UpdateProfileCommandHandler
    : IRequestHandler<UpdateProfileCommand, UpdateProfileResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateProfileCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateProfileResult> Handle(
        UpdateProfileCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get existing account WITH CustomerAccount navigation
        var account = await _unitOfWork
            .Repository<Account>()
            .GetByIdAsync(command.AccountId, a => a.CustomerAccount!);

        if (account == null || !account.IsActive)
        {
            throw new NotFoundException("Tài khoản không tồn tại hoặc không hoạt động.");
        }

        // 2. Update account profile (email + phone only, avatar is a separate command)
        account.UpdateProfile(command.Email, command.Phone, account.Avatar, account.PublicIdAvatar);

        // 3. Update customer info (FullName, Birthday) if account is linked
        Customer? customer = null;
        if (account.CustomerAccount != null)
        {
            customer = await _unitOfWork
                .Repository<Customer>()
                .GetByIdAsync(account.CustomerAccount.CustomerId);

            if (customer != null)
            {
                customer.UpdateInfo(
                    command.Email,
                    command.FullName ?? customer.FullName,
                    command.Birthday ?? customer.Birthday
                );
            }
        }

        // 4. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 5. Return result
        return new UpdateProfileResult
        {
            AccountId = account.Id,
            Email = account.Email,
            Phone = account.Phone,
            Avatar = account.Avatar,
            FullName = customer?.FullName,
            Birthday = customer?.Birthday,
            UpdatedAt = account.UpdatedAt,
        };
    }
}
