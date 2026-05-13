using MediatR;

public class UpdateStaffCommandHandler : IRequestHandler<UpdateStaffCommand, UpdateStaffResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateStaffCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateStaffResult> Handle(
        UpdateStaffCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get existing staff with details
        var staff = await _unitOfWork.Staffs.GetByIdWithDetailsAsync(command.Id);
        if (staff == null)
        {
            throw new NotFoundException("Không tìm thấy nhân viên.");
        }

        // 2. Update staff info using domain method
        staff.UpdateInfo(command.FullName.Trim());

        // 3. Transfer store if changed
        if (staff.StoreId != command.StoreId)
        {
            staff.TransferToStore(command.StoreId);
        }

        // 4. Update account active status
        if (command.IsActive && !staff.Account.IsActive)
        {
            staff.Account.Activate();
        }
        else if (!command.IsActive && staff.Account.IsActive)
        {
            staff.Account.Deactivate();
        }

        // 5. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 6. Reload store info if store changed
        var store = await _unitOfWork.Stores.GetByIdAsync(staff.StoreId, cancellationToken);

        // 7. Return result
        return new UpdateStaffResult
        {
            Id = staff.Id,
            AccountId = staff.AccountId,
            FullName = staff.FullName ?? string.Empty,
            Email = staff.Account.Email,
            Phone = staff.Account.Phone,
            StoreId = staff.StoreId,
            StoreName = store?.Name ?? string.Empty,
            StoreCode = store?.Code ?? string.Empty,
            IsActive = staff.Account.IsActive,
            UpdatedAt = staff.UpdatedAt,
        };
    }
}
