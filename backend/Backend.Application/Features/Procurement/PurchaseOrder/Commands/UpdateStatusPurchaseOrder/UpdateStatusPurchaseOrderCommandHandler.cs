using System.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class UpdateStatusPurchaseOrderCommandHandler
    : IRequestHandler<UpdateStatusPurchaseOrderCommand, UpdateStatusPurchaseOrderResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateStatusPurchaseOrderCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateStatusPurchaseOrderResult> Handle(
        UpdateStatusPurchaseOrderCommand command,
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

                // 2. Validate status transition
                ValidateStatusTransition(purchaseOrder.Status, command.NewStatus);

                var oldStatus = purchaseOrder.Status;

                // 3. Update status
                purchaseOrder.Status = command.NewStatus;

                // 4. Handle RECEIVED status - add to inventory
                if (command.NewStatus == PurchaseStatus.RECEIVED)
                {
                    await AddToInventoryAsync(purchaseOrder, cancellationToken);
                }

                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return new UpdateStatusPurchaseOrderResult
                {
                    Id = purchaseOrder.Id,
                    VendorName = purchaseOrder.Vendor.Name,
                    StoreName = purchaseOrder.Store.Name,
                    OldStatus = oldStatus,
                    NewStatus = purchaseOrder.Status,
                    UpdatedAt = purchaseOrder.UpdatedAt,
                };
            },
            IsolationLevel.RepeatableRead // Important for inventory updates
        );
    }

    private static void ValidateStatusTransition(
        PurchaseStatus currentStatus,
        PurchaseStatus newStatus
    )
    {
        // Define valid transitions
        // CREATED -> ORDERED, CANCELLED
        // ORDERED -> RECEIVED, CANCELLED
        // RECEIVED -> (no transitions)
        // CANCELLED -> (no transitions)

        var validTransitions = new Dictionary<PurchaseStatus, HashSet<PurchaseStatus>>
        {
            {
                PurchaseStatus.CREATED,
                new HashSet<PurchaseStatus> { PurchaseStatus.ORDERED, PurchaseStatus.CANCELLED }
            },
            {
                PurchaseStatus.ORDERED,
                new HashSet<PurchaseStatus> { PurchaseStatus.RECEIVED, PurchaseStatus.CANCELLED }
            },
            { PurchaseStatus.RECEIVED, new HashSet<PurchaseStatus>() },
            { PurchaseStatus.CANCELLED, new HashSet<PurchaseStatus>() },
        };

        if (
            !validTransitions.TryGetValue(currentStatus, out var allowedStatuses)
            || !allowedStatuses.Contains(newStatus)
        )
        {
            throw new BadException(
                $"Không thể chuyển trạng thái từ '{GetStatusDisplayName(currentStatus)}' sang '{GetStatusDisplayName(newStatus)}'."
            );
        }
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

    private async Task AddToInventoryAsync(
        PurchaseOrder purchaseOrder,
        CancellationToken cancellationToken
    )
    {
        var sellableItemIds = purchaseOrder.Items.Select(i => i.SellableItemId).Distinct().ToList();

        // Get existing inventory for this store and sellable items
        var existingInventory = await _unitOfWork
            .Inventories.Query()
            .Where(inv =>
                inv.StoreId == purchaseOrder.StoreId && sellableItemIds.Contains(inv.SellableItemId)
            )
            .ToListAsync(cancellationToken);

        var existingInventoryMap = existingInventory.ToDictionary(
            inv => inv.SellableItemId,
            inv => inv
        );

        var newInventories = new List<Inventory>();

        foreach (var item in purchaseOrder.Items)
        {
            if (existingInventoryMap.TryGetValue(item.SellableItemId, out var inventory))
            {
                // Update existing inventory
                inventory.OnHand += item.Quantity;
            }
            else
            {
                // Create new inventory entry
                // Generate RowVersion for PostgreSQL (xmin column needs initial value)
                newInventories.Add(
                    new Inventory
                    {
                        StoreId = purchaseOrder.StoreId,
                        SellableItemId = item.SellableItemId,
                        OnHand = item.Quantity,
                        Reserved = 0,
                        RowVersion = Guid.NewGuid().ToByteArray()[..8], // 8 bytes for concurrency token
                    }
                );
            }
        }

        if (newInventories.Any())
        {
            await _unitOfWork.Inventories.AddRangeAsync(newInventories, cancellationToken);
        }
    }
}
