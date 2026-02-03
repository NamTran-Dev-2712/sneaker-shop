using MediatR;
using Microsoft.EntityFrameworkCore;

public class RemoveItemCartCommandHandler
    : IRequestHandler<RemoveItemCartCommand, RemoveItemCartResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public RemoveItemCartCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<RemoveItemCartResult> Handle(
        RemoveItemCartCommand command,
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
            throw new UnauthorizedAccessException("Bạn không có quyền xóa sản phẩm này.");
        }

        // 3. Store info for response
        var removedQuantity = cartItem.Quantity;
        var sellableItemId = cartItem.SellableItemId;
        var cart = cartItem.Cart;

        // 4. Remove cart item
        _unitOfWork.CartItems.Remove(cartItem);

        // 5. Update cart total count
        cart.TotalCount -= removedQuantity;
        if (cart.TotalCount < 0)
            cart.TotalCount = 0;
        cart.UpdatedAt = DateTime.UtcNow;
        _unitOfWork.Carts.Update(cart);

        // 6. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 7. Get remaining items count
        var remainingItems = await _unitOfWork
            .CartItems.Query()
            .AsNoTracking()
            .CountAsync(ci => ci.CartId == cart.Id, cancellationToken);

        // 8. Return result
        return new RemoveItemCartResult
        {
            RemovedCartItemId = command.CartItemId,
            SellableItemId = sellableItemId,
            RemovedQuantity = removedQuantity,
            RemainingCartItems = remainingItems,
            TotalCartItems = cart.TotalCount,
            Message = "Đã xóa sản phẩm khỏi giỏ hàng.",
        };
    }
}
