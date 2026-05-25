public class PurchaseOrderItemRepository
    : GenericRepository<PurchaseOrderItem>,
        IPurchaseOrderItemRepository
{
    public PurchaseOrderItemRepository(ApplicationDbContext context)
        : base(context) { }
}
