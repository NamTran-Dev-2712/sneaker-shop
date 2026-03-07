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

        // 3. Get customer information and cart count if linked
        Customer? customer = null;
        int cartItemCount = 0;
        if (account.CustomerAccount != null)
        {
            customer = await _unitOfWork
                .Repository<Customer>()
                .GetByIdAsync(account.CustomerAccount.CustomerId);

            // Get cart item count
            var cart = await _unitOfWork.Carts.GetByCustomerIdWithItemsAsync(
                account.CustomerAccount.CustomerId,
                cancellationToken
            );
            cartItemCount = cart?.TotalCount ?? 0;
        }

        // 4. Get staff profile info if role is STAFF
        StaffProfileInfo? staffProfileInfo = null;
        if (account.Role == Role.STAFF)
        {
            var staffProfile = account.StaffProfile;
            if (staffProfile != null)
            {
                var staffWithDetails = await _unitOfWork.Staffs.GetByIdWithDetailsAsync(
                    staffProfile.Id
                );
                if (staffWithDetails != null)
                {
                    staffProfileInfo = new StaffProfileInfo
                    {
                        StaffId = staffWithDetails.Id,
                        StoreId = staffWithDetails.StoreId,
                        StoreName = staffWithDetails.Store.Name,
                        StoreCode = staffWithDetails.Store.Code,
                        StoreAddress = staffWithDetails.Store.Address,
                        StorePhone = staffWithDetails.Store.Phone,
                    };
                }
            }
        }

        // 5. Return profile result
        return new ProfileResult
        {
            AccountId = account.Id,
            CustomerId = customer?.Id,
            Email = account.Email ?? string.Empty,
            IsEmailVerified = account.IsEmailVerified,
            Phone = account.Phone,
            FullName =
                account.Role == Role.STAFF
                    ? (account.StaffProfile?.FullName ?? string.Empty)
                    : (customer?.FullName ?? string.Empty),
            Avatar = account.Avatar,
            Birthday = customer?.Birthday,
            Role = account.Role,
            CartItemCount = cartItemCount,
            StaffProfile = staffProfileInfo,
        };
    }
}
