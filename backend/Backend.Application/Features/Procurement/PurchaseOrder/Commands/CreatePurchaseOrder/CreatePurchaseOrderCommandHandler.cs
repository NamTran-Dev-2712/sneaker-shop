using System.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class CreatePurchaseOrderCommandHandler
    : IRequestHandler<CreatePurchaseOrderCommand, CreatePurchaseOrderResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreatePurchaseOrderCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CreatePurchaseOrderResult> Handle(
        CreatePurchaseOrderCommand command,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork.ExecuteInTransactionAsync(
            async () =>
            {
                // 1. Verify vendor exists and active
                var vendor = await _unitOfWork.Vendors.GetByIdAsync(
                    command.VendorId,
                    cancellationToken
                );
                if (vendor == null || vendor.IsDeleted || !vendor.IsActive)
                {
                    throw new BadException("Nhà cung cấp không hợp lệ hoặc không hoạt động.");
                }

                // 2. Verify store exists and active
                var store = await _unitOfWork.Stores.GetByIdAsync(
                    command.StoreId,
                    cancellationToken
                );
                if (store == null || store.IsDeleted || !store.IsActive)
                {
                    throw new BadException("Cửa hàng không hợp lệ hoặc không hoạt động.");
                }

                // 3. Validate items - verify all sellable items exist
                var sellableItemIds = command
                    .Items.Select(i => i.SellableItemId)
                    .Distinct()
                    .ToList();
                var existingSellableItems = await _unitOfWork
                    .SellableItems.Query()
                    .Where(si => sellableItemIds.Contains(si.Id))
                    .Select(si => si.Id)
                    .ToListAsync(cancellationToken);

                var missingItems = sellableItemIds.Except(existingSellableItems).ToList();
                if (missingItems.Any())
                {
                    throw new BadException(
                        $"Không tìm thấy sản phẩm với ID: {string.Join(", ", missingItems)}"
                    );
                }

                // 4. Create purchase order
                var purchaseOrder = new PurchaseOrder
                {
                    VendorId = command.VendorId,
                    StoreId = command.StoreId,
                    Status = PurchaseStatus.CREATED,
                    ExpectedAt = command.ExpectedAt,
                    Note = command.Note,
                };

                await _unitOfWork.PurchaseOrders.AddAsync(purchaseOrder, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // 5. Create purchase order items
                var orderItems = command
                    .Items.Select(item => new PurchaseOrderItem
                    {
                        PurchaseOrderId = purchaseOrder.Id,
                        SellableItemId = item.SellableItemId,
                        Quantity = item.Quantity,
                        UnitCost = item.UnitCost,
                    })
                    .ToList();

                await _unitOfWork.PurchaseOrderItems.AddRangeAsync(orderItems, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return new CreatePurchaseOrderResult
                {
                    Id = purchaseOrder.Id,
                    VendorId = purchaseOrder.VendorId,
                    VendorName = vendor.Name,
                    StoreId = purchaseOrder.StoreId,
                    StoreName = store.Name,
                    Status = purchaseOrder.Status,
                    ExpectedAt = purchaseOrder.ExpectedAt,
                    Note = purchaseOrder.Note,
                    TotalCost = orderItems.Sum(i => i.GetTotalCost()),
                    ItemCount = orderItems.Count,
                    CreatedAt = purchaseOrder.CreatedAt,
                };
            },
            IsolationLevel.ReadCommitted
        );
    }
}
