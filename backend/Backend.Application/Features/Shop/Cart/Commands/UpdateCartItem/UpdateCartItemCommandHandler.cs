using MediatR;
using Microsoft.EntityFrameworkCore;

public class UpdateCartItemCommandHandler
    : IRequestHandler<UpdateCartItemCommand, UpdateCartItemResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCartItemCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateCartItemResult> Handle(
        UpdateCartItemCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get cart item with cart info
        var cartItem = await _unitOfWork
            .CartItems.Query()
            .Include(ci => ci.Cart)
            .FirstOrDefaultAsync(ci => ci.Id == command.CartItemId, cancellationToken);

        if (cartItem == null)
        {
            throw new InvalidOperationException("Sản phẩm không tồn tại trong giỏ hàng.");
        }

        // 2. Verify ownership
        if (cartItem.Cart.CustomerId != command.CustomerId)
        {
            throw new UnauthorizedAccessException("Bạn không có quyền chỉnh sửa sản phẩm này.");
        }

        // 3. Get total available inventory across all stores
        var totalAvailable = await GetTotalAvailableInventoryAsync(
            cartItem.SellableItemId,
            cancellationToken
        );

        // 4. Validate new quantity against available inventory
        if (command.Quantity > totalAvailable)
        {
            throw new InvalidOperationException(
                $"Số lượng yêu cầu ({command.Quantity}) vượt quá số lượng tồn kho ({totalAvailable})."
            );
        }

        // 5. Store old quantity for response
        var oldQuantity = cartItem.Quantity;

        // 6. Update cart item
        cartItem.UpdateQuantity(command.Quantity);

        // Update inventory source if specified
        if (command.InventoryId.HasValue)
        {
            cartItem.InventoryId = command.InventoryId.Value;
        }

        _unitOfWork.CartItems.Update(cartItem);

        // 7. Update cart total count
        var quantityDiff = command.Quantity - oldQuantity;
        cartItem.Cart.TotalCount += quantityDiff;
        cartItem.Cart.UpdatedAt = DateTime.UtcNow;
        _unitOfWork.Carts.Update(cartItem.Cart);

        // 8. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 9. Return result
        return new UpdateCartItemResult
        {
            CartItemId = cartItem.Id,
            SellableItemId = cartItem.SellableItemId,
            InventoryId = cartItem.InventoryId,
            OldQuantity = oldQuantity,
            NewQuantity = command.Quantity,
            TotalCartItems = cartItem.Cart.TotalCount,
            TotalAvailableInventory = totalAvailable,
            Message = "Cập nhật số lượng thành công.",
        };
    }

    private async Task<int> GetTotalAvailableInventoryAsync(
        int sellableItemId,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork
            .Inventories.Query()
            .AsNoTracking()
            .Where(i => i.SellableItemId == sellableItemId)
            .SumAsync(i => i.OnHand - i.Reserved, cancellationToken);
    }
}
