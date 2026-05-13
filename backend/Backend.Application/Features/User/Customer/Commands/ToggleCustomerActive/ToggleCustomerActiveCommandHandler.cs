using MediatR;
using Microsoft.EntityFrameworkCore;

public class ToggleCustomerActiveCommandHandler
    : IRequestHandler<ToggleCustomerActiveCommand, ToggleCustomerActiveResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public ToggleCustomerActiveCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ToggleCustomerActiveResult> Handle(
        ToggleCustomerActiveCommand command,
        CancellationToken cancellationToken
    )
    {
        var customerAccount = await _unitOfWork
            .Customers.Query()
            .Include(c => c.CustomerAccount)
                .ThenInclude(ca => ca != null ? ca.Account : null)
            .Where(c => c.Id == command.CustomerId)
            .Select(c => c.CustomerAccount)
            .FirstOrDefaultAsync(cancellationToken);

        if (customerAccount == null)
        {
            throw new NotFoundException(
                $"Không tìm thấy tài khoản cho khách hàng #{command.CustomerId}."
            );
        }

        var account = customerAccount.Account;
        account.IsActive = !account.IsActive;
        account.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Accounts.Update(account);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new ToggleCustomerActiveResult
        {
            CustomerId = command.CustomerId,
            AccountId = account.Id,
            IsActive = account.IsActive,
            Message = account.IsActive
                ? "Tài khoản đã được kích hoạt."
                : "Tài khoản đã bị vô hiệu hóa.",
        };
    }
}
