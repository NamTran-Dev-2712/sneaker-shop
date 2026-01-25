public interface IAccessoryImageRepository : IGenericRepository<AccessoryImage>
{
    Task<List<AccessoryImage>> GetByAccessoryIdAsync(
        int accessoryId,
        CancellationToken cancellationToken = default
    );

    Task DeleteByAccessoryIdAsync(int accessoryId, CancellationToken cancellationToken = default);
}
