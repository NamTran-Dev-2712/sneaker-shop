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
    private IColorRepository? _colorRepository;
    private ISizeRepository? _sizeRepository;
    private ISneakerRepository? _sneakerRepository;
    private ISneakerColorwayRepository? _sneakerColorwayRepository;
    private ISneakerVariantRepository? _sneakerVariantRepository;
    private ISneakerSubImageRepository? _sneakerSubImageRepository;
    private ISellableItemRepository? _sellableItemRepository;
    private ICategoryAccessoryRepository? _categoryAccessoryRepository;
    private IBrandCategoryAccessoryRepository? _brandCategoryAccessoryRepository;
    private IAccessoryRepository? _accessoryRepository;
    private IAccessoryImageRepository? _accessoryImageRepository;
    private IVendorRepository? _vendorRepository;
    private IVendorPriceRepository? _vendorPriceRepository;
    private IPurchaseOrderRepository? _purchaseOrderRepository;
    private IPurchaseOrderItemRepository? _purchaseOrderItemRepository;
    private IInventoryRepository? _inventoryRepository;
    private ICartRepository? _cartRepository;
    private ICartItemRepository? _cartItemRepository;
    private IOrderRepository? _orderRepository;
    private IOrderItemRepository? _orderItemRepository;
    private IPaymentRepository? _paymentRepository;
    private IOrderFulfillmentRepository? _orderFulfillmentRepository;
    private ISlideRepository? _slideRepository;
    private IExternalAuthProviderRepository? _externalAuthProviderRepository;
    private IFinanceLedgerEntryRepository? _financeLedgerEntryRepository;
    private IVoucherRepository? _voucherRepository;
    private IVoucherRedemptionRepository? _voucherRedemptionRepository;

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
    public IColorRepository Colors => _colorRepository ??= new ColorRepository(_context);
    public ISizeRepository Sizes => _sizeRepository ??= new SizeRepository(_context);
    public ISneakerRepository Sneakers => _sneakerRepository ??= new SneakerRepository(_context);
    public ISneakerColorwayRepository SneakerColorways =>
        _sneakerColorwayRepository ??= new SneakerColorwayRepository(_context);
    public ISneakerVariantRepository SneakerVariants =>
        _sneakerVariantRepository ??= new SneakerVariantRepository(_context);
    public ISneakerSubImageRepository SneakerSubImages =>
        _sneakerSubImageRepository ??= new SneakerSubImageRepository(_context);
    public ISellableItemRepository SellableItems =>
        _sellableItemRepository ??= new SellableItemRepository(_context);
    public ICategoryAccessoryRepository CategoryAccessories =>
        _categoryAccessoryRepository ??= new CategoryAccessoryRepository(_context);
    public IBrandCategoryAccessoryRepository BrandCategoryAccessories =>
        _brandCategoryAccessoryRepository ??= new BrandCategoryAccessoryRepository(_context);
    public IAccessoryRepository Accessories =>
        _accessoryRepository ??= new AccessoryRepository(_context);
    public IAccessoryImageRepository AccessoryImages =>
        _accessoryImageRepository ??= new AccessoryImageRepository(_context);
    public IVendorRepository Vendors => _vendorRepository ??= new VendorRepository(_context);
    public IVendorPriceRepository VendorPrices =>
        _vendorPriceRepository ??= new VendorPriceRepository(_context);
    public IPurchaseOrderRepository PurchaseOrders =>
        _purchaseOrderRepository ??= new PurchaseOrderRepository(_context);
    public IPurchaseOrderItemRepository PurchaseOrderItems =>
        _purchaseOrderItemRepository ??= new PurchaseOrderItemRepository(_context);
    public IInventoryRepository Inventories =>
        _inventoryRepository ??= new InventoryRepository(_context);
    public ICartRepository Carts => _cartRepository ??= new CartRepository(_context);
    public ICartItemRepository CartItems =>
        _cartItemRepository ??= new CartItemRepository(_context);
    public IOrderRepository Orders => _orderRepository ??= new OrderRepository(_context);
    public IOrderItemRepository OrderItems =>
        _orderItemRepository ??= new OrderItemRepository(_context);
    public IPaymentRepository Payments => _paymentRepository ??= new PaymentRepository(_context);
    public IOrderFulfillmentRepository OrderFulfillments =>
        _orderFulfillmentRepository ??= new OrderFulfillmentRepository(_context);
    public ISlideRepository Slides => _slideRepository ??= new SlideRepository(_context);
    public IExternalAuthProviderRepository ExternalAuthProviders =>
        _externalAuthProviderRepository ??= new ExternalAuthProviderRepository(_context);
    public IFinanceLedgerEntryRepository FinanceLedgerEntries =>
        _financeLedgerEntryRepository ??= new FinanceLedgerEntryRepository(_context);
    public IVoucherRepository Vouchers => _voucherRepository ??= new VoucherRepository(_context);
    public IVoucherRedemptionRepository VoucherRedemptions =>
        _voucherRedemptionRepository ??= new VoucherRedemptionRepository(_context);

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

    public async Task<TResult> ExecuteInTransactionAsync<TResult>(
        Func<Task<TResult>> operation,
        IsolationLevel isolationLevel = IsolationLevel.ReadCommitted
    )
    {
        // Use execution strategy to support retry
        var strategy = _context.Database.CreateExecutionStrategy();

        return await strategy.ExecuteAsync(async () =>
        {
            using var transaction = await _context.Database.BeginTransactionAsync(isolationLevel);
            try
            {
                var result = await operation();
                await transaction.CommitAsync();
                return result;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        });
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
