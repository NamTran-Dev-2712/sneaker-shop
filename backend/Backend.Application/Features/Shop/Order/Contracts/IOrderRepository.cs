public interface IOrderRepository : IGenericRepository<Order>
{
    /// <summary>
    /// Find an existing order by its idempotency key to prevent duplicates.
    /// </summary>
    Task<Order?> GetByIdempotencyKeyAsync(
        string idempotencyKey,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Fetch an order with Payments using SELECT FOR UPDATE (pessimistic lock).
    /// Use inside a transaction to prevent concurrent state mutations (e.g., double mark-paid).
    /// </summary>
    Task<Order?> GetByIdWithLockAsync(int orderId, CancellationToken cancellationToken = default);
}
