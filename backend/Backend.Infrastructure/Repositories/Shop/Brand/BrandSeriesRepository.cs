using Microsoft.EntityFrameworkCore;

public class BrandSeriesRepository : GenericRepository<BrandSeries>, IBrandSeriesRepository
{
    public BrandSeriesRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<bool> ExistsByNameInBrandAsync(
        string name,
        int brandId,
        int? excludeId = null
    )
    {
        var normalizedName = name.Trim().ToLower();
        return await _dbSet.AnyAsync(bs =>
            bs.Name.ToLower() == normalizedName
            && bs.BrandId == brandId
            && !bs.IsDeleted
            && (excludeId == null || bs.Id != excludeId)
        );
    }

    public async Task<bool> ExistsBySlugAsync(string slug, int? excludeId = null)
    {
        return await _dbSet.AnyAsync(bs =>
            bs.Slug == slug && !bs.IsDeleted && (excludeId == null || bs.Id != excludeId)
        );
    }
}
