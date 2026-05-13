public class VoucherRedemptionRepository
    : GenericRepository<VoucherRedemption>,
        IVoucherRedemptionRepository
{
    public VoucherRedemptionRepository(ApplicationDbContext context)
        : base(context) { }
}
