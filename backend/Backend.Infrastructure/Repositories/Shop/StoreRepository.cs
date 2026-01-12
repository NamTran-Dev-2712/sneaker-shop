using Microsoft.EntityFrameworkCore;

public class StoreRepository : GenericRepository<Store>, IStoreRepository
{
    public StoreRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<bool> ExistsByCodeAsync(string code, int? excludeId = null)
    {
        var normalizedCode = code.Trim().ToLower();
        return await _dbSet.AnyAsync(s =>
            s.Code.ToLower() == normalizedCode
            && !s.IsDeleted
            && (excludeId == null || s.Id != excludeId)
        );
    }

    public async Task<bool> ExistsByNameAsync(string name, int? excludeId = null)
    {
        var normalizedName = name.Trim().ToLower();
        return await _dbSet.AnyAsync(s =>
            s.Name.ToLower() == normalizedName
            && !s.IsDeleted
            && (excludeId == null || s.Id != excludeId)
        );
    }
}
