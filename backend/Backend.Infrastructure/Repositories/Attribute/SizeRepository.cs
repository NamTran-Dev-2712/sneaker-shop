using Microsoft.EntityFrameworkCore;

public class SizeRepository : GenericRepository<Size>, ISizeRepository
{
    public SizeRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<bool> ExistsBySystemValueAsync(
        string system,
        decimal value,
        int? excludeId = null
    )
    {
        var normalizedSystem = system.Trim().ToUpper();
        return await _dbSet.AnyAsync(s =>
            s.System.ToUpper() == normalizedSystem
            && s.Value == value
            && (excludeId == null || s.Id != excludeId)
        );
    }

    public async Task<bool> HasDependentProductsAsync(int sizeId)
    {
        return await _dbSet
            .Where(s => s.Id == sizeId)
            .SelectMany(s => s.SneakerVariants)
            .AnyAsync();
    }
}
