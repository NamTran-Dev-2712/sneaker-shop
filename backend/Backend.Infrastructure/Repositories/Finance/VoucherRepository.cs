public class VoucherRepository : GenericRepository<Voucher>, IVoucherRepository
{
    public VoucherRepository(ApplicationDbContext context)
        : base(context) { }
}
