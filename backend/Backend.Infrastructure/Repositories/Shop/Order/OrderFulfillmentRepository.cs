public class OrderFulfillmentRepository
    : GenericRepository<OrderFulfillment>,
        IOrderFulfillmentRepository
{
    public OrderFulfillmentRepository(ApplicationDbContext context)
        : base(context) { }
}
