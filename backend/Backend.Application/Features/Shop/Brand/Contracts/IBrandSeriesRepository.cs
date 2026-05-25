public interface IBrandSeriesRepository : IGenericRepository<BrandSeries>
{
    Task<bool> ExistsByNameInBrandAsync(string name, int brandId, int? excludeId = null);
    Task<bool> ExistsBySlugAsync(string slug, int? excludeId = null);
}
