using System.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class UpdatePurchaseOrderCommandHandler
    : IRequestHandler<UpdatePurchaseOrderCommand, UpdatePurchaseOrderResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdatePurchaseOrderCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdatePurchaseOrderResult> Handle(
        UpdatePurchaseOrderCommand command,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork.ExecuteInTransactionAsync(
            async () =>
            {
                // 1. Get purchase order with items
                var purchaseOrder = await _unitOfWork
                    .PurchaseOrders.Query()
                    .Include(po => po.Vendor)
                    .Include(po => po.Store)
                    .Include(po => po.Items)
                    .FirstOrDefaultAsync(po => po.Id == command.Id, cancellationToken);

                if (purchaseOrder == null)
                {
                    throw new NotFoundException("Không tìm thấy đơn đặt hàng.");
                }

                // 2. Can only update if status is CREATED
                if (purchaseOrder.Status != PurchaseStatus.CREATED)
                {
                    throw new BadException(
                        "Chỉ có thể cập nhật đơn hàng khi trạng thái là 'Đã tạo'."
                    );
                }

                // 3. Validate sellable items exist
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

                // 4. Update order info
                purchaseOrder.ExpectedAt = command.ExpectedAt;
                purchaseOrder.Note = command.Note;

                // 5. Handle items: delete removed, update existing, add new
                var incomingItemIds = command
                    .Items.Where(i => i.Id.HasValue)
                    .Select(i => i.Id!.Value)
                    .ToHashSet();
                var existingItemIds = purchaseOrder.Items.Select(i => i.Id).ToHashSet();

                // Delete items not in incoming list
                var itemsToDelete = purchaseOrder
                    .Items.Where(i => !incomingItemIds.Contains(i.Id))
                    .ToList();
                foreach (var item in itemsToDelete)
                {
                    _unitOfWork.PurchaseOrderItems.Remove(item);
                    purchaseOrder.Items.Remove(item);
                }

                // Update existing items
                foreach (var incomingItem in command.Items.Where(i => i.Id.HasValue))
                {
                    var existingItem = purchaseOrder.Items.FirstOrDefault(i =>
                        i.Id == incomingItem.Id
                    );
                    if (existingItem != null)
                    {
                        existingItem.SellableItemId = incomingItem.SellableItemId;
                        existingItem.Quantity = incomingItem.Quantity;
                        existingItem.UnitCost = incomingItem.UnitCost;
                    }
                }

                // Add new items
                var newItems = command
                    .Items.Where(i => !i.Id.HasValue)
                    .Select(item => new PurchaseOrderItem
                    {
                        PurchaseOrderId = purchaseOrder.Id,
                        SellableItemId = item.SellableItemId,
                        Quantity = item.Quantity,
                        UnitCost = item.UnitCost,
                    })
                    .ToList();

                if (newItems.Any())
                {
                    await _unitOfWork.PurchaseOrderItems.AddRangeAsync(newItems, cancellationToken);
                }

                await _unitOfWork.SaveChangesAsync(cancellationToken);

                // Recalculate totals
                var allItems = purchaseOrder.Items.Concat(newItems).ToList();

                return new UpdatePurchaseOrderResult
                {
                    Id = purchaseOrder.Id,
                    VendorId = purchaseOrder.VendorId,
                    VendorName = purchaseOrder.Vendor.Name,
                    StoreId = purchaseOrder.StoreId,
                    StoreName = purchaseOrder.Store.Name,
                    Status = purchaseOrder.Status,
                    ExpectedAt = purchaseOrder.ExpectedAt,
                    Note = purchaseOrder.Note,
                    TotalCost = allItems.Sum(i => i.GetTotalCost()),
                    ItemCount = allItems.Count,
                    UpdatedAt = purchaseOrder.UpdatedAt,
                };
            },
            IsolationLevel.ReadCommitted
        );
    }
}
