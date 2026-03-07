using MediatR;

public class ChangePasswordCommandHandler
    : IRequestHandler<ChangePasswordCommand, ChangePasswordResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;

    public ChangePasswordCommandHandler(IUnitOfWork unitOfWork, IPasswordHasher passwordHasher)
    {
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
    }

    public async Task<ChangePasswordResult> Handle(
        ChangePasswordCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Load account
        var account = await _unitOfWork.Repository<Account>().GetByIdAsync(command.AccountId);

        if (account == null || !account.IsActive)
        {
            throw new NotFoundException("Tài khoản không tồn tại hoặc không hoạt động.");
        }

        // 2. Verify current password
        if (!account.HasPassword())
        {
            throw new BadException("Tài khoản này chưa thiết lập mật khẩu.");
        }

        var isCurrentPasswordValid = _passwordHasher.VerifyPassword(
            command.CurrentPassword,
            account.Password!
        );

        if (!isCurrentPasswordValid)
        {
            throw new BadException("Mật khẩu hiện tại không đúng.");
        }

        // 3. Hash and update new password
        var newPasswordHash = _passwordHasher.HashPassword(command.NewPassword);
        account.UpdatePassword(newPasswordHash);

        // 4. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new ChangePasswordResult { Message = "Đổi mật khẩu thành công." };
    }
}
