public interface ISneakerVariantRepository : IGenericRepository<SneakerVariant>
{
    Task<bool> ExistsAsync(int colorwayId, int sizeId, int? excludeId = null);
}
