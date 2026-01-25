using Microsoft.EntityFrameworkCore;

public class AccessoryImageRepository : GenericRepository<AccessoryImage>, IAccessoryImageRepository
{
    public AccessoryImageRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<List<AccessoryImage>> GetByAccessoryIdAsync(
        int accessoryId,
        CancellationToken cancellationToken = default
    )
    {
        return await _dbSet
            .AsNoTracking()
            .Where(img => img.AccessoryId == accessoryId)
            .OrderBy(img => img.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task DeleteByAccessoryIdAsync(
        int accessoryId,
        CancellationToken cancellationToken = default
    )
    {
        var images = await _dbSet
            .Where(img => img.AccessoryId == accessoryId)
            .ToListAsync(cancellationToken);

        _dbSet.RemoveRange(images);
    }
}
