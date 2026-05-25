using Microsoft.EntityFrameworkCore;

public class CartRepository : GenericRepository<Cart>, ICartRepository
{
    public CartRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }

    public async Task<Cart?> GetByCustomerIdAsync(
        int customerId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Set<Cart>()
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.CustomerId == customerId, cancellationToken);
    }

    public async Task<Cart?> GetByCustomerIdWithItemsAsync(
        int customerId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Set<Cart>()
            .Include(c => c.Items)
                .ThenInclude(i => i.SellableItem)
                    .ThenInclude(s => s.SneakerVariant)
                        .ThenInclude(sv => sv!.Colorway)
                            .ThenInclude(cw => cw.Sneaker)
                                .ThenInclude(sn => sn.Brand)
            .Include(c => c.Items)
                .ThenInclude(i => i.SellableItem)
                    .ThenInclude(s => s.SneakerVariant)
                        .ThenInclude(sv => sv!.Colorway)
                            .ThenInclude(cw => cw.Color)
            .Include(c => c.Items)
                .ThenInclude(i => i.SellableItem)
                    .ThenInclude(s => s.SneakerVariant)
                        .ThenInclude(sv => sv!.Size)
            .Include(c => c.Items)
                .ThenInclude(i => i.SellableItem)
                    .ThenInclude(s => s.Accessory)
                        .ThenInclude(a => a!.Brand)
            .Include(c => c.Items)
                .ThenInclude(i => i.SellableItem)
                    .ThenInclude(s => s.Inventories)
            .Include(c => c.Items)
                .ThenInclude(i => i.Inventory)
                    .ThenInclude(inv => inv.Store)
            .AsSplitQuery()
            .FirstOrDefaultAsync(c => c.CustomerId == customerId, cancellationToken);
    }

    public async Task<bool> ExistsByCustomerIdAsync(
        int customerId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Set<Cart>()
            .AsNoTracking()
            .AnyAsync(c => c.CustomerId == customerId, cancellationToken);
    }
}
