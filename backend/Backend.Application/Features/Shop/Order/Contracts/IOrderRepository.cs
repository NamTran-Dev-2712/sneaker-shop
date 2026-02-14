public interface IOrderRepository : IGenericRepository<Order>
{
    /// <summary>
    /// Find an existing order by its idempotency key to prevent duplicates.
    /// </summary>
    Task<Order?> GetByIdempotencyKeyAsync(
        string idempotencyKey,
        CancellationToken cancellationToken = default
    );
}
