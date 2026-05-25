using Microsoft.EntityFrameworkCore;

public class OrderRepository : GenericRepository<Order>, IOrderRepository
{
    public OrderRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<Order?> GetByIdempotencyKeyAsync(
        string idempotencyKey,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Set<Order>()
            .AsNoTracking()
            .Include(o => o.OrderItems)
            .Include(o => o.Payments)
            .Include(o => o.OrderFulfillment)
            .FirstOrDefaultAsync(o => o.IdempotencyKey == idempotencyKey, cancellationToken);
    }

    public async Task<Order?> GetByIdWithLockAsync(
        int orderId,
        CancellationToken cancellationToken = default
    )
    {
        // SELECT ... FOR UPDATE — acquires a row-level lock for the duration of the transaction.
        // Concurrent callers will block here until the lock is released, preventing double-writes.
        // Must be called inside an active transaction (ExecuteInTransactionAsync).
        return await _context
            .Set<Order>()
            .FromSqlInterpolated($"SELECT * FROM orders WHERE id = {orderId} FOR UPDATE")
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(cancellationToken);
    }
}
