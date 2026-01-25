using MediatR;
using Microsoft.EntityFrameworkCore;

public class DeletePurchaseOrderCommandHandler
    : IRequestHandler<DeletePurchaseOrderCommand, DeletePurchaseOrderResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeletePurchaseOrderCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<DeletePurchaseOrderResult> Handle(
        DeletePurchaseOrderCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get purchase order
        var purchaseOrder = await _unitOfWork
            .PurchaseOrders.Query()
            .Include(po => po.Vendor)
            .Include(po => po.Store)
            .FirstOrDefaultAsync(po => po.Id == command.Id, cancellationToken);

        if (purchaseOrder == null)
        {
            throw new NotFoundException("Không tìm thấy đơn đặt hàng.");
        }

        // 2. Can only cancel if status is CREATED
        if (purchaseOrder.Status != PurchaseStatus.CREATED)
        {
            throw new BadException(
                $"Chỉ có thể hủy đơn hàng khi trạng thái là 'Đã tạo'. Trạng thái hiện tại: '{GetStatusDisplayName(purchaseOrder.Status)}'."
            );
        }

        // 3. Set status to CANCELLED (soft delete)
        purchaseOrder.Status = PurchaseStatus.CANCELLED;
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new DeletePurchaseOrderResult
        {
            Id = purchaseOrder.Id,
            VendorName = purchaseOrder.Vendor.Name,
            StoreName = purchaseOrder.Store.Name,
            Status = purchaseOrder.Status,
            Message = "Đơn đặt hàng đã được hủy thành công.",
        };
    }

    private static string GetStatusDisplayName(PurchaseStatus status) =>
        status switch
        {
            PurchaseStatus.CREATED => "Đã tạo",
            PurchaseStatus.ORDERED => "Đã đặt hàng",
            PurchaseStatus.RECEIVED => "Đã nhận hàng",
            PurchaseStatus.CANCELLED => "Đã hủy",
            _ => status.ToString(),
        };
}
