public interface ISellableItemRepository : IGenericRepository<SellableItem>
{
    /// <summary>
    /// Generate unique SKU for Sneaker Variant
    /// </summary>
    Task<string> GenerateSkuAsync(
        string brandCode,
        string sneakerCode,
        string colorCode,
        string sizeCode
    );

    /// <summary>
    /// Generate unique SKU for Accessory
    /// </summary>
    Task<string> GenerateAccessorySkuAsync(string categoryCode, string brandCode);

    /// <summary>
    /// Check if SKU exists
    /// </summary>
    Task<bool> ExistsBySkuAsync(string sku);

    /// <summary>
    /// Get SellableItem by Accessory ID
    /// </summary>
    Task<SellableItem?> GetByAccessoryIdAsync(
        int accessoryId,
        CancellationToken cancellationToken = default
    );
}
