public interface IAccessoryRepository : IGenericRepository<Accessory>
{
    /// <summary>
    /// Check if an accessory with the given slug exists
    /// </summary>
    Task<bool> ExistsBySlugAsync(string slug, CancellationToken cancellationToken = default);

    /// <summary>
    /// Check if accessory is used in any orders (to determine soft vs hard delete)
    /// </summary>
    Task<bool> HasOrderDependenciesAsync(int id, CancellationToken cancellationToken = default);
}
