using System.Data;

public interface IUnitOfWork
{
    IGenericRepository<T> Repository<T>()
        where T : class;

    ICustomerRepository Customers { get; }
    IStaffRepository Staffs { get; }
    IAccountRepository Accounts { get; }
    IBrandRepository Brands { get; }
    IBrandSeriesRepository BrandSeries { get; }
    IStoreRepository Stores { get; }
    IColorRepository Colors { get; }
    ISizeRepository Sizes { get; }
    ISneakerRepository Sneakers { get; }
    ISneakerColorwayRepository SneakerColorways { get; }
    ISneakerVariantRepository SneakerVariants { get; }
    ISneakerSubImageRepository SneakerSubImages { get; }
    ISellableItemRepository SellableItems { get; }

    // Transaction Management
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(IsolationLevel isolationLevel = IsolationLevel.ReadCommitted);
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();

    Task<TResult> ExecuteInTransactionAsync<TResult>(
        Func<Task<TResult>> operation,
        IsolationLevel isolationLevel = IsolationLevel.ReadCommitted
    );

    // Change Tracking
    void DetachAllEntities();
    void ClearChangeTracker();
}
