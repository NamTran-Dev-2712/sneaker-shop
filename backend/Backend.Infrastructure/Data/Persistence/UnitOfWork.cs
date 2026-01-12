using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private bool _disposed = false;

    // repositories
    private IAccountRepository? _accountRepository;
    private ICustomerRepository? _customerRepository;
    private IStaffRepository? _staffRepository;
    private IBrandRepository? _brandRepository;
    private IBrandSeriesRepository? _brandSeriesRepository;
    private IStoreRepository? _storeRepository;

    // dictionary to hold repositories
    private readonly Dictionary<Type, object> _repositories = new();

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    // lazy repository initialization
    public IAccountRepository Accounts => _accountRepository ??= new AccountRepository(_context);
    public ICustomerRepository Customers =>
        _customerRepository ??= new CustomerRepository(_context);
    public IStaffRepository Staffs => _staffRepository ??= new StaffRepository(_context);
    public IBrandRepository Brands => _brandRepository ??= new BrandRepository(_context);
    public IBrandSeriesRepository BrandSeries =>
        _brandSeriesRepository ??= new BrandSeriesRepository(_context);
    public IStoreRepository Stores => _storeRepository ??= new StoreRepository(_context);

    // generic repository accessor
    public IGenericRepository<T> Repository<T>()
        where T : class
    {
        var type = typeof(T);

        if (!_repositories.ContainsKey(type))
        {
            var repositoryType = typeof(GenericRepository<>);
            var repositoryInstance = Activator.CreateInstance(
                repositoryType.MakeGenericType(typeof(T)),
                _context
            );

            _repositories[type] = repositoryInstance!;
        }

        return (IGenericRepository<T>)_repositories[type];
    }

    // Transaction Management
    public async Task BeginTransactionAsync(
        IsolationLevel isolationLevel = IsolationLevel.ReadCommitted
    )
    {
        await _context.Database.BeginTransactionAsync(isolationLevel);
    }

    public async Task CommitTransactionAsync()
    {
        try
        {
            await SaveChangesAsync();
            await _context.Database.CommitTransactionAsync();
        }
        catch
        {
            await RollbackTransactionAsync();
            throw;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        await _context.Database.RollbackTransactionAsync();
    }

    // Save Changes
    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    // Change Tracking
    public void DetachAllEntities()
    {
        var entries = _context
            .ChangeTracker.Entries()
            .Where(e =>
                e.State == EntityState.Added
                || e.State == EntityState.Modified
                || e.State == EntityState.Deleted
            )
            .ToList();

        foreach (var entry in entries)
        {
            entry.State = EntityState.Detached;
        }
    }

    public void ClearChangeTracker()
    {
        _context.ChangeTracker.Clear();
    }

    // Dispose Pattern
    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            _disposed = true;
        }
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }
}
