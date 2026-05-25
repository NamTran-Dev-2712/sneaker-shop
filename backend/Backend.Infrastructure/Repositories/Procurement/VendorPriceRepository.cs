public class VendorPriceRepository : GenericRepository<VendorPrice>, IVendorPriceRepository
{
    public VendorPriceRepository(ApplicationDbContext context)
        : base(context) { }
}
