public interface ICartItemRepository : IGenericRepository<CartItem>
{
    /// <summary>
    /// Get cart item by cart ID and sellable item ID
    /// Used to check for duplicate items (unique constraint: cart_id, sellable_item_id)
    /// </summary>
    Task<CartItem?> GetByCartAndSellableItemAsync(
        int cartId,
        int sellableItemId,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Get all items in a cart with product details
    /// </summary>
    Task<IReadOnlyList<CartItem>> GetByCartIdWithDetailsAsync(
        int cartId,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Check if an item exists in cart
    /// </summary>
    Task<bool> ExistsInCartAsync(
        int cartId,
        int sellableItemId,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Delete all items in a cart (for clear cart operation)
    /// </summary>
    Task DeleteAllByCartIdAsync(int cartId, CancellationToken cancellationToken = default);
}
