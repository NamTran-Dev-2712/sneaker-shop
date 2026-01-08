public class StaffRepository : GenericRepository<StaffProfile>, IStaffRepository
{
    public StaffRepository(ApplicationDbContext context)
        : base(context) { }
}
