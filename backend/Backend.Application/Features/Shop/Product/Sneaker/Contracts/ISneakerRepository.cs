public interface ISneakerRepository : IGenericRepository<Sneaker>
{
    Task<bool> ExistsByNameAsync(string name, int? excludeId = null);
    Task<bool> ExistsBySlugAsync(string slug, int? excludeId = null);
    Task<Sneaker?> GetWithColorwaysAndVariantsAsync(
        int id,
        CancellationToken cancellationToken = default
    );
}
