public interface ISlideRepository : IGenericRepository<Slide>
{
    Task<bool> ExistsByTitleAsync(string title, int? excludeId = null);
}
