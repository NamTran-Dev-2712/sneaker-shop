using Microsoft.EntityFrameworkCore;

public class CategoryAccessoryRepository
    : GenericRepository<CategoryAccessory>,
        ICategoryAccessoryRepository
{
    public CategoryAccessoryRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<bool> ExistsBySlugAsync(
        string slug,
        CancellationToken cancellationToken = default
    )
    {
        return await _dbSet
            .AsNoTracking()
            .AnyAsync(c => c.Slug == slug && !c.IsDeleted, cancellationToken);
    }

    public async Task<bool> HasDependenciesAsync(
        int id,
        CancellationToken cancellationToken = default
    )
    {
        return await _context
            .Set<Accessory>()
            .AsNoTracking()
            .AnyAsync(a => a.CategoryId == id && !a.IsDeleted, cancellationToken);
    }

    public async Task<CategoryAccessory?> GetBySlugAsync(
        string slug,
        CancellationToken cancellationToken = default
    )
    {
        return await _dbSet.FirstOrDefaultAsync(
            c => c.Slug == slug && !c.IsDeleted,
            cancellationToken
        );
    }
}
