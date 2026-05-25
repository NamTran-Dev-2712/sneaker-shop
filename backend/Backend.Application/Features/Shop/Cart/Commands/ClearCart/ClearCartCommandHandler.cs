using MediatR;
using Microsoft.EntityFrameworkCore;

public class ClearCartCommandHandler : IRequestHandler<ClearCartCommand, ClearCartResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public ClearCartCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ClearCartResult> Handle(
        ClearCartCommand command,
        CancellationToken cancellationToken
    )
    {
        // 1. Get cart with items count
        var cart = await _unitOfWork
            .Carts.Query()
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.CustomerId == command.CustomerId, cancellationToken);

        if (cart == null)
        {
            throw new InvalidOperationException("Giỏ hàng không tồn tại.");
        }

        // 2. Store info for response
        var removedItemsCount = cart.Items.Count;
        var removedTotalQuantity = cart.TotalCount;

        if (removedItemsCount == 0)
        {
            return new ClearCartResult
            {
                CartId = cart.Id,
                RemovedItemsCount = 0,
                RemovedTotalQuantity = 0,
                Message = "Giỏ hàng đã trống.",
            };
        }

        // 3. Delete all items using bulk delete (optimized)
        await _unitOfWork.CartItems.DeleteAllByCartIdAsync(cart.Id, cancellationToken);

        // 4. Update cart
        cart.TotalCount = 0;
        cart.UpdatedAt = DateTime.UtcNow;
        _unitOfWork.Carts.Update(cart);

        // 5. Save changes
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 6. Return result
        return new ClearCartResult
        {
            CartId = cart.Id,
            RemovedItemsCount = removedItemsCount,
            RemovedTotalQuantity = removedTotalQuantity,
            Message = $"Đã xóa {removedItemsCount} sản phẩm khỏi giỏ hàng.",
        };
    }
}
