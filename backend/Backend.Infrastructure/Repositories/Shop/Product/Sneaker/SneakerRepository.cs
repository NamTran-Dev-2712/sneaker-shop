using Microsoft.EntityFrameworkCore;

public class SneakerRepository : GenericRepository<Sneaker>, ISneakerRepository
{
    public SneakerRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<bool> ExistsByNameAsync(string name, int? excludeId = null)
    {
        var normalizedName = name.Trim().ToLower();
        return await _dbSet.AnyAsync(s =>
            s.Name.ToLower() == normalizedName
            && !s.IsDeleted
            && (excludeId == null || s.Id != excludeId)
        );
    }

    public async Task<bool> ExistsBySlugAsync(string slug, int? excludeId = null)
    {
        return await _dbSet.AnyAsync(s =>
            s.Slug == slug && !s.IsDeleted && (excludeId == null || s.Id != excludeId)
        );
    }

    public async Task<Sneaker?> GetWithColorwaysAndVariantsAsync(
        int id,
        CancellationToken cancellationToken = default
    )
    {
        return await _dbSet
            .Include(s => s.Brand)
            .Include(s => s.BrandSeries)
            .Include(s => s.Colorways.Where(c => c.IsActive))
                .ThenInclude(c => c.Color)
            .Include(s => s.Colorways.Where(c => c.IsActive))
                .ThenInclude(c => c.Variants)
                    .ThenInclude(v => v.Size)
            .Include(s => s.Colorways.Where(c => c.IsActive))
                .ThenInclude(c => c.Variants)
                    .ThenInclude(v => v.SellableItem)
            .AsSplitQuery()
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted, cancellationToken);
    }
}
