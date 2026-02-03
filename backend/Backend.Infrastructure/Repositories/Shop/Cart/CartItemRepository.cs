using Microsoft.EntityFrameworkCore;

public class CartItemRepository : GenericRepository<CartItem>, ICartItemRepository
{
    public CartItemRepository(ApplicationDbContext dbContext)
        : base(dbContext) { }

    public async Task<CartItem?> GetByCartAndSellableItemAsync(
        int cartId,
        int sellableItemId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Set<CartItem>()
            .FirstOrDefaultAsync(
                ci => ci.CartId == cartId && ci.SellableItemId == sellableItemId,
                cancellationToken
            );
    }

    public async Task<IReadOnlyList<CartItem>> GetByCartIdWithDetailsAsync(
        int cartId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Set<CartItem>()
            .AsNoTracking()
            .Include(ci => ci.SellableItem)
                .ThenInclude(s => s.SneakerVariant)
                    .ThenInclude(sv => sv!.Colorway)
                        .ThenInclude(cw => cw.Sneaker)
            .Include(ci => ci.SellableItem)
                .ThenInclude(s => s.SneakerVariant)
                    .ThenInclude(sv => sv!.Colorway)
                        .ThenInclude(cw => cw.Color)
            .Include(ci => ci.SellableItem)
                .ThenInclude(s => s.SneakerVariant)
                    .ThenInclude(sv => sv!.Size)
            .Include(ci => ci.SellableItem)
                .ThenInclude(s => s.Accessory)
            .Include(ci => ci.SellableItem)
                .ThenInclude(s => s.Inventories)
            .Include(ci => ci.Inventory)
                .ThenInclude(inv => inv.Store)
            .AsSplitQuery()
            .Where(ci => ci.CartId == cartId)
            .OrderByDescending(ci => ci.UpdatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsInCartAsync(
        int cartId,
        int sellableItemId,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Set<CartItem>()
            .AsNoTracking()
            .AnyAsync(
                ci => ci.CartId == cartId && ci.SellableItemId == sellableItemId,
                cancellationToken
            );
    }

    public async Task DeleteAllByCartIdAsync(
        int cartId,
        CancellationToken cancellationToken = default
    )
    {
        await _context
            .Set<CartItem>()
            .Where(ci => ci.CartId == cartId)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
