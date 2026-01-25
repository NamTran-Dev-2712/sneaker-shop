using MediatR;

public class UpdateVendorCommandHandler : IRequestHandler<UpdateVendorCommand, UpdateVendorResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateVendorCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateVendorResult> Handle(
        UpdateVendorCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get vendor
        var vendor = await _unitOfWork.Vendors.GetByIdAsync(command.Id, cancellationToken);
        if (vendor == null || vendor.IsDeleted)
        {
            throw new NotFoundException("Không tìm thấy nhà cung cấp.");
        }

        // 2. Check for duplicate phone/email (exclude current)
        var existingVendor = await _unitOfWork.Vendors.GetFirstOrDefaultAsync(v =>
            !v.IsDeleted
            && v.Id != command.Id
            && (v.Phone == command.Phone || v.Email == command.Email)
        );

        if (existingVendor != null)
        {
            if (existingVendor.Phone == command.Phone)
                throw new BadException("Số điện thoại nhà cung cấp đã tồn tại.");
            if (existingVendor.Email == command.Email)
                throw new BadException("Email nhà cung cấp đã tồn tại.");
        }

        // 3. Update vendor
        vendor.UpdateInfo(command.Name, command.Phone, command.Email, command.Address);
        if (command.IsActive)
            vendor.Activate();
        else
            vendor.Deactivate();

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new UpdateVendorResult
        {
            Id = vendor.Id,
            Name = vendor.Name,
            Phone = vendor.Phone,
            Email = vendor.Email,
            Address = vendor.Address,
            IsActive = vendor.IsActive,
            UpdatedAt = vendor.UpdatedAt,
        };
    }
}
