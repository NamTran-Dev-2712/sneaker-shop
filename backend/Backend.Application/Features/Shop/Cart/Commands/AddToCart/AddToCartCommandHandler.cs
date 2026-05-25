using System.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class AddToCartCommandHandler : IRequestHandler<AddToCartCommand, AddToCartResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public AddToCartCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<AddToCartResult> Handle(
        AddToCartCommand command,
        CancellationToken cancellationToken
    )
    {
        // Use transaction to ensure atomicity (create cart + add item)
        return await _unitOfWork.ExecuteInTransactionAsync(
            async () => await ProcessAddToCartAsync(command, cancellationToken),
            IsolationLevel.ReadCommitted
        );
    }

    private async Task<AddToCartResult> ProcessAddToCartAsync(
        AddToCartCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get or create cart for customer
        var (cart, isNewCart) = await GetOrCreateCartAsync(command.CustomerId, cancellationToken);

        // 2. Validate inventory availability
        var inventory = await _unitOfWork.Inventories.GetByIdAsync(command.InventoryId);
        if (inventory == null)
        {
            throw new InvalidOperationException("Kho hàng không tồn tại.");
        }

        // 3. Check if item already exists in cart (unique constraint: cart_id, sellable_item_id)
        var existingItem = await _unitOfWork.CartItems.GetByCartAndSellableItemAsync(
            cart.Id,
            command.SellableItemId,
            cancellationToken
        );

        CartItem cartItem;
        bool isMerged = false;
        int finalQuantity;

        if (existingItem != null)
        {
            // 4a. Merge: increment quantity of existing item
            finalQuantity = existingItem.Quantity + command.Quantity;

            // Validate total quantity doesn't exceed available inventory
            var totalAvailable = await GetTotalAvailableInventoryAsync(
                command.SellableItemId,
                cancellationToken
            );

            if (finalQuantity > totalAvailable)
            {
                throw new InvalidOperationException(
                    $"Số lượng yêu cầu ({finalQuantity}) vượt quá số lượng tồn kho ({totalAvailable})."
                );
            }

            existingItem.UpdateQuantity(finalQuantity);
            existingItem.InventoryId = command.InventoryId; // Update to new inventory if changed
            _unitOfWork.CartItems.Update(existingItem);
            cartItem = existingItem;
            isMerged = true;
        }
        else
        {
            // 4b. Add new item to cart
            finalQuantity = command.Quantity;

            // Validate quantity against available inventory
            var totalAvailable = await GetTotalAvailableInventoryAsync(
                command.SellableItemId,
                cancellationToken
            );

            if (finalQuantity > totalAvailable)
            {
                throw new InvalidOperationException(
                    $"Số lượng yêu cầu ({finalQuantity}) vượt quá số lượng tồn kho ({totalAvailable})."
                );
            }

            cartItem = new CartItem
            {
                CartId = cart.Id,
                SellableItemId = command.SellableItemId,
                InventoryId = command.InventoryId,
                Quantity = command.Quantity,
            };

            await _unitOfWork.CartItems.AddAsync(cartItem, cancellationToken);
        }

        // 5. Update cart total count
        cart.TotalCount =
            await CalculateCartTotalAsync(cart.Id, cancellationToken)
            + (existingItem == null ? command.Quantity : command.Quantity);
        cart.UpdatedAt = DateTime.UtcNow;
        _unitOfWork.Carts.Update(cart);

        // 6. Save all changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 7. Return result
        return new AddToCartResult
        {
            CartId = cart.Id,
            CartItemId = cartItem.Id,
            SellableItemId = command.SellableItemId,
            InventoryId = command.InventoryId,
            Quantity = finalQuantity,
            TotalCartItems = cart.TotalCount,
            IsNewCart = isNewCart,
            IsMerged = isMerged,
            Message = isMerged
                ? "Sản phẩm đã được cập nhật số lượng trong giỏ hàng."
                : "Sản phẩm đã được thêm vào giỏ hàng.",
        };
    }

    private async Task<(Cart cart, bool isNew)> GetOrCreateCartAsync(
        int customerId,
        CancellationToken cancellationToken
    )
    {
        var existingCart = await _unitOfWork.Carts.GetFirstOrDefaultAsync(c =>
            c.CustomerId == customerId
        );

        if (existingCart != null)
        {
            return (existingCart, false);
        }

        // Create new cart for customer
        var newCart = new Cart { CustomerId = customerId, TotalCount = 0 };

        await _unitOfWork.Carts.AddAsync(newCart, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return (newCart, true);
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

    private async Task<int> CalculateCartTotalAsync(int cartId, CancellationToken cancellationToken)
    {
        return await _unitOfWork
            .CartItems.Query()
            .AsNoTracking()
            .Where(ci => ci.CartId == cartId)
            .SumAsync(ci => ci.Quantity, cancellationToken);
    }
}
