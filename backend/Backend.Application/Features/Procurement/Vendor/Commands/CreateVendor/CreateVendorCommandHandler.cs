using MediatR;

public class CreateVendorCommandHandler : IRequestHandler<CreateVendorCommand, CreateVendorResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateVendorCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CreateVendorResult> Handle(
        CreateVendorCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Check if vendor with same phone or email exists
        var existingVendor = await _unitOfWork.Vendors.GetFirstOrDefaultAsync(v =>
            !v.IsDeleted && (v.Phone == command.Phone || v.Email == command.Email)
        );

        if (existingVendor != null)
        {
            if (existingVendor.Phone == command.Phone)
                throw new BadException("Số điện thoại nhà cung cấp đã tồn tại.");
            if (existingVendor.Email == command.Email)
                throw new BadException("Email nhà cung cấp đã tồn tại.");
        }

        // 2. Create vendor
        var vendor = new Vendor
        {
            Name = command.Name,
            Phone = command.Phone,
            Email = command.Email,
            Address = command.Address,
            IsActive = true,
            IsDeleted = false,
        };

        await _unitOfWork.Vendors.AddAsync(vendor, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new CreateVendorResult
        {
            Id = vendor.Id,
            Name = vendor.Name,
            Phone = vendor.Phone,
            Email = vendor.Email,
            Address = vendor.Address,
            IsActive = vendor.IsActive,
            CreatedAt = vendor.CreatedAt,
        };
    }
}
