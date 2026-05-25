public class VendorRepository : GenericRepository<Vendor>, IVendorRepository
{
    public VendorRepository(ApplicationDbContext context)
        : base(context) { }
}
