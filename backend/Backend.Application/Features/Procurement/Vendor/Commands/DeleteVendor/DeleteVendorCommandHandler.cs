using MediatR;
using Microsoft.EntityFrameworkCore;

public class DeleteVendorCommandHandler : IRequestHandler<DeleteVendorCommand, DeleteVendorResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteVendorCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteVendorResult> Handle(
        DeleteVendorCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get vendor
        var vendor = await _unitOfWork.Vendors.GetByIdAsync(command.Id, cancellationToken);
        if (vendor == null || vendor.IsDeleted)
        {
            throw new NotFoundException("Không tìm thấy nhà cung cấp.");
        }

        // 2. Check if vendor has any pending purchase orders (CREATED or ORDERED)
        var hasPendingOrders = await _unitOfWork
            .PurchaseOrders.Query()
            .AnyAsync(
                po =>
                    po.VendorId == command.Id
                    && (po.Status == PurchaseStatus.CREATED || po.Status == PurchaseStatus.ORDERED),
                cancellationToken
            );

        if (hasPendingOrders)
        {
            throw new BadException("Không thể xóa nhà cung cấp đang có đơn hàng chưa hoàn tất.");
        }

        // 3. Soft delete vendor
        vendor.IsDeleted = true;
        vendor.IsActive = false;
        vendor.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DeleteVendorResult { Success = true, Message = "Xóa nhà cung cấp thành công." };
    }
}
