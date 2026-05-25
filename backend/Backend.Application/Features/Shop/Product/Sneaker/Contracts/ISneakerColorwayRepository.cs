public interface ISneakerColorwayRepository : IGenericRepository<SneakerColorway>
{
    Task<bool> ExistsAsync(int sneakerId, int colorId, int? excludeId = null);
}
