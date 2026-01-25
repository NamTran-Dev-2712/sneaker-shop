public class InventoryRepository : GenericRepository<Inventory>, IInventoryRepository
{
    public InventoryRepository(ApplicationDbContext context)
        : base(context) { }
}
