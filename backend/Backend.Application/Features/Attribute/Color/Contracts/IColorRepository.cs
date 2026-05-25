public interface IColorRepository : IGenericRepository<Color>
{
    Task<bool> ExistsByNameAsync(string name, int? excludeId = null);
    Task<bool> ExistsByHexAsync(string hex, int? excludeId = null);
    Task<bool> ExistsBySlugAsync(string slug, int? excludeId = null);
    Task<bool> HasDependentProductsAsync(int colorId);
}
