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
}
