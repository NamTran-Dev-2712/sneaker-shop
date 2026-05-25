using Microsoft.EntityFrameworkCore;

public class SneakerColorwayRepository
    : GenericRepository<SneakerColorway>,
        ISneakerColorwayRepository
{
    public SneakerColorwayRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<bool> ExistsAsync(int sneakerId, int colorId, int? excludeId = null)
    {
        return await _dbSet.AnyAsync(sc =>
            sc.SneakerId == sneakerId
            && sc.ColorId == colorId
            && (excludeId == null || sc.Id != excludeId)
        );
    }
}
