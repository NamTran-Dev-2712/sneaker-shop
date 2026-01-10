using MediatR;

public class GetProfileQueryHandler : IRequestHandler<GetProfileQuery, ProfileResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetProfileQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ProfileResult> Handle(
        GetProfileQuery query,
        CancellationToken cancellationToken
    )
    {
        // 1. Get account by ID
        var account = await _unitOfWork.Accounts.GetAccountByIdAsync(query.AccountId);
        if (account == null)
        {
            throw new NotFoundException("Không tìm thấy tài khoản.");
        }

        // 2. Check if account is active
        if (!account.IsActive)
        {
            throw new UnauthorizedException(
                "Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ bộ phận hỗ trợ."
            );
        }

        // 3. Get customer information if linked
        Customer? customer = null;
        if (account.CustomerAccount != null)
        {
            customer = await _unitOfWork
                .Repository<Customer>()
                .GetByIdAsync(account.CustomerAccount.CustomerId);
        }

        // 4. Return profile result
        return new ProfileResult
        {
            AccountId = account.Id,
            Email = account.Email ?? string.Empty,
            IsEmailVerified = account.IsEmailVerified,
            Phone = account.Phone,
            FullName = customer?.FullName ?? string.Empty,
            Avatar = account.Avatar,
            Birthday = customer?.Birthday,
            Role = account.Role,
        };
    }
}
