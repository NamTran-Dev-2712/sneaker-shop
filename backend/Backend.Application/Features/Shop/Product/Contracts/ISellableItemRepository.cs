public interface ISellableItemRepository : IGenericRepository<SellableItem>
{
    Task<string> GenerateSkuAsync(
        string brandCode,
        string sneakerCode,
        string colorCode,
        string sizeCode
    );
    Task<bool> ExistsBySkuAsync(string sku);
}
