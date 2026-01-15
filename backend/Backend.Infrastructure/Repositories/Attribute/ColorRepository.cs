using Microsoft.EntityFrameworkCore;

public class ColorRepository : GenericRepository<Color>, IColorRepository
{
    public ColorRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<bool> ExistsByNameAsync(string name, int? excludeId = null)
    {
        var normalizedName = name.Trim().ToLower();
        return await _dbSet.AnyAsync(c =>
            c.Name.ToLower() == normalizedName && (excludeId == null || c.Id != excludeId)
        );
    }

    public async Task<bool> ExistsByHexAsync(string hex, int? excludeId = null)
    {
        var normalizedHex = hex.Trim().ToUpper();
        return await _dbSet.AnyAsync(c =>
            c.Hex.ToUpper() == normalizedHex && (excludeId == null || c.Id != excludeId)
        );
    }

    public async Task<bool> ExistsBySlugAsync(string slug, int? excludeId = null)
    {
        return await _dbSet.AnyAsync(c =>
            c.Slug == slug && (excludeId == null || c.Id != excludeId)
        );
    }

    public async Task<bool> HasDependentProductsAsync(int colorId)
    {
        return await _dbSet
            .Where(c => c.Id == colorId)
            .SelectMany(c => c.SneakerColorways)
            .AnyAsync();
    }
}
