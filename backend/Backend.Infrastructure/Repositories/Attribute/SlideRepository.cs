using Microsoft.EntityFrameworkCore;

public class SlideRepository : GenericRepository<Slide>, ISlideRepository
{
    public SlideRepository(ApplicationDbContext context)
        : base(context) { }

    public async Task<bool> ExistsByTitleAsync(string title, int? excludeId = null)
    {
        var normalizedTitle = title.Trim().ToLower();
        return await _dbSet.AnyAsync(s =>
            s.Title.ToLower() == normalizedTitle && (excludeId == null || s.Id != excludeId)
        );
    }
}
