using MediatR;

public class GetStaffDetailQueryHandler : IRequestHandler<GetStaffDetailQuery, GetStaffDetailResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetStaffDetailQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetStaffDetailResult> Handle(
        GetStaffDetailQuery query,
        CancellationToken cancellationToken
    )
    {
        // 1. Get staff with details
        var staff = await _unitOfWork.Staffs.GetByIdWithDetailsAsync(query.Id);
        if (staff == null)
        {
            throw new NotFoundException("Không tìm thấy nhân viên.");
        }

        // 2. Return result
        return new GetStaffDetailResult
        {
            Id = staff.Id,
            AccountId = staff.AccountId,
            FullName = staff.FullName ?? string.Empty,
            Email = staff.Account.Email,
            Phone = staff.Account.Phone,
            Avatar = staff.Account.Avatar,
            StoreId = staff.StoreId,
            StoreName = staff.Store.Name,
            StoreCode = staff.Store.Code,
            StoreAddress = staff.Store.Address,
            StorePhone = staff.Store.Phone,
            IsActive = staff.Account.IsActive,
            CreatedAt = staff.CreatedAt,
            UpdatedAt = staff.UpdatedAt,
        };
    }
}
