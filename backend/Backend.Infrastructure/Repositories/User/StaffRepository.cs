using Microsoft.EntityFrameworkCore;

public class StaffRepository : GenericRepository<StaffProfile>, IStaffRepository
{
    public StaffRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<StaffProfile?> GetByIdWithDetailsAsync(int id)
    {
        return await _dbSet
            .Include(s => s.Account)
            .Include(s => s.Store)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<bool> ExistsByAccountIdAsync(int accountId)
    {
        return await _dbSet.AnyAsync(s => s.AccountId == accountId);
    }
}
