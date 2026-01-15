public interface ISizeRepository : IGenericRepository<Size>
{
    Task<bool> ExistsBySystemValueAsync(string system, decimal value, int? excludeId = null);
    Task<bool> HasDependentProductsAsync(int sizeId);
}
