public interface IStaffRepository : IGenericRepository<StaffProfile>
{
    Task<StaffProfile?> GetByIdWithDetailsAsync(int id);
    Task<bool> ExistsByAccountIdAsync(int accountId);
}
