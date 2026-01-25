public class SneakerSubImageRepository
    : GenericRepository<SneakerSubImage>,
        ISneakerSubImageRepository
{
    public SneakerSubImageRepository(ApplicationDbContext context)
        : base(context) { }
}
