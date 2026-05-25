using Microsoft.EntityFrameworkCore;

public class SneakerVariantRepository : GenericRepository<SneakerVariant>, ISneakerVariantRepository
{
    public SneakerVariantRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<bool> ExistsAsync(int colorwayId, int sizeId, int? excludeId = null)
    {
        return await _dbSet.AnyAsync(sv =>
            sv.ColorwayId == colorwayId
            && sv.SizeId == sizeId
            && (excludeId == null || sv.Id != excludeId)
        );
    }
}
