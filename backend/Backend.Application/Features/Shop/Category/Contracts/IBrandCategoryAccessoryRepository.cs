public interface IBrandCategoryAccessoryRepository : IGenericRepository<BrandCategoryAccessory>
{
    Task<bool> ExistsBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<bool> HasDependenciesAsync(int id, CancellationToken cancellationToken = default);
    Task<List<BrandCategoryAccessory>> GetByCategoryIdAsync(
        int categoryId,
        CancellationToken cancellationToken = default
    );
}
