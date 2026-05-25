public interface ICartRepository : IGenericRepository<Cart>
{
    /// <summary>
    /// Get cart by customer ID (without items)
    /// </summary>
    Task<Cart?> GetByCustomerIdAsync(int customerId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get cart by customer ID with all items and related entities for display
    /// Uses AsSplitQuery to avoid cartesian explosion
    /// </summary>
    Task<Cart?> GetByCustomerIdWithItemsAsync(
        int customerId,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Check if customer already has a cart
    /// </summary>
    Task<bool> ExistsByCustomerIdAsync(
        int customerId,
        CancellationToken cancellationToken = default
    );
}
