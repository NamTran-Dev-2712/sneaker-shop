public interface IStoreRepository : IGenericRepository<Store>
{
    Task<bool> ExistsByCodeAsync(string code, int? excludeId = null);
    Task<bool> ExistsByNameAsync(string name, int? excludeId = null);
}
