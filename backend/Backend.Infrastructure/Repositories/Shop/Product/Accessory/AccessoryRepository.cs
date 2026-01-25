using Microsoft.EntityFrameworkCore;

public class AccessoryRepository : GenericRepository<Accessory>, IAccessoryRepository
{
    public AccessoryRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<bool> ExistsBySlugAsync(
        string slug,
        CancellationToken cancellationToken = default
    )
    {
        return await _dbSet
            .AsNoTracking()
            .AnyAsync(a => a.Slug == slug && !a.IsDeleted, cancellationToken);
    }

    public async Task<bool> HasOrderDependenciesAsync(
        int id,
        CancellationToken cancellationToken = default
    )
    {
        // Check if accessory is used in any order through SellableItem
        var sellableItem = await _context
            .Set<SellableItem>()
            .AsNoTracking()
            .FirstOrDefaultAsync(si => si.AccessoryId == id, cancellationToken);

        if (sellableItem == null)
            return false;

        return await _context
            .Set<OrderItem>()
            .AsNoTracking()
            .AnyAsync(oi => oi.SellableItemId == sellableItem.Id, cancellationToken);
    }
}
