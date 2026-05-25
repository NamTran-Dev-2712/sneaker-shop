public interface ICategoryAccessoryRepository : IGenericRepository<CategoryAccessory>
{
    Task<bool> ExistsBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<bool> HasDependenciesAsync(int id, CancellationToken cancellationToken = default);
    Task<CategoryAccessory?> GetBySlugAsync(
        string slug,
        CancellationToken cancellationToken = default
    );
}
