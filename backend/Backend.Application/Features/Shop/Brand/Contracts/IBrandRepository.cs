public interface IBrandRepository : IGenericRepository<Brand>
{
    Task<bool> ExistsByNameAsync(string name, int? excludeId = null);
    Task<bool> ExistsBySlugAsync(string slug, int? excludeId = null);
}
