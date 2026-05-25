using Microsoft.EntityFrameworkCore;

public class BrandCategoryAccessoryRepository
    : GenericRepository<BrandCategoryAccessory>,
        IBrandCategoryAccessoryRepository
{
    public BrandCategoryAccessoryRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<bool> ExistsBySlugAsync(
        string slug,
        CancellationToken cancellationToken = default
    )
    {
        return await _dbSet
            .AsNoTracking()
            .AnyAsync(b => b.Slug == slug && !b.IsDeleted, cancellationToken);
    }

    public async Task<bool> HasDependenciesAsync(
        int id,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Set<Accessory>()
            .AsNoTracking()
            .AnyAsync(a => a.BrandId == id && !a.IsDeleted, cancellationToken);
    }

    public async Task<List<BrandCategoryAccessory>> GetByCategoryIdAsync(
        int categoryId,
        CancellationToken cancellationToken = default
    )
    {
        return await _dbSet
            .AsNoTracking()
            .Where(b => b.CategoryId == categoryId && !b.IsDeleted)
            .OrderBy(b => b.Name)
            .ToListAsync(cancellationToken);
    }
}
