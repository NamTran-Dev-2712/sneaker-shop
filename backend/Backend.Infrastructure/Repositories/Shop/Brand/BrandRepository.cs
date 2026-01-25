using Microsoft.EntityFrameworkCore;

public class BrandRepository : GenericRepository<Brand>, IBrandRepository
{
    public BrandRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<bool> ExistsByNameAsync(string name, int? excludeId = null)
    {
        var normalizedName = name.Trim().ToLower();
        return await _dbSet.AnyAsync(b =>
            b.Name.ToLower() == normalizedName
            && !b.IsDeleted
            && (excludeId == null || b.Id != excludeId)
        );
    }

    public async Task<bool> ExistsBySlugAsync(string slug, int? excludeId = null)
    {
        return await _dbSet.AnyAsync(b =>
            b.Slug == slug && !b.IsDeleted && (excludeId == null || b.Id != excludeId)
        );
    }
}
