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

    // Transaction Management
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(IsolationLevel isolationLevel = IsolationLevel.ReadCommitted);
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();

    // Change Tracking
    void DetachAllEntities();
    void ClearChangeTracker();
}
