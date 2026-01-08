using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

public class ApplicationDbContext : DbContext
{
    private IDbContextTransaction? _currentTransaction;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    // Account & Profile DbSets
    public DbSet<Account> Accounts { get; set; }
    public DbSet<StaffProfile> StaffProfiles { get; set; }
    public DbSet<AdminProfile> AdminProfiles { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<CustomerAccount> CustomerAccounts { get; set; }

    // Store DbSet
    public DbSet<Store> Stores { get; set; }

    // Sneaker Product DbSets
    public DbSet<Brand> Brands { get; set; }
    public DbSet<BrandSeries> BrandSeries { get; set; }
    public DbSet<Color> Colors { get; set; }
    public DbSet<Size> Sizes { get; set; }
    public DbSet<Sneaker> Sneakers { get; set; }
    public DbSet<SneakerColorway> SneakerColorways { get; set; }
    public DbSet<SneakerVariant> SneakerVariants { get; set; }

    // Accessory Product DbSets
    public DbSet<CategoryAccessory> CategoryAccessories { get; set; }
    public DbSet<BrandCategoryAccessory> BrandCategoryAccessories { get; set; }
    public DbSet<Accessory> Accessories { get; set; }
    public DbSet<AccessoryImage> AccessoryImages { get; set; }

    // Sellable Item & Inventory DbSets
    public DbSet<SellableItem> SellableItems { get; set; }
    public DbSet<Inventory> Inventories { get; set; }

    // Order DbSets
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<OrderFulfillment> OrderFulfillments { get; set; }

    // Cart DbSets
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }

    // Loyalty & Voucher DbSets
    public DbSet<LoyaltyAccount> LoyaltyAccounts { get; set; }
    public DbSet<LoyaltyTransaction> LoyaltyTransactions { get; set; }
    public DbSet<Voucher> Vouchers { get; set; }
    public DbSet<VoucherRedemption> VoucherRedemptions { get; set; }

    // Purchase Order DbSets
    public DbSet<Vendor> Vendors { get; set; }
    public DbSet<VendorPrice> VendorPrices { get; set; }
    public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
    public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }

    // Return & Restock DbSets
    public DbSet<Return> Returns { get; set; }
    public DbSet<ReturnItem> ReturnItems { get; set; }
    public DbSet<RestockRequest> RestockRequests { get; set; }

    public IDbContextTransaction? GetCurrentTransaction() => _currentTransaction;

    public bool HasActiveTransaction => _currentTransaction != null;

    public async Task<IDbContextTransaction> BeginTransactionAsync()
    {
        if (_currentTransaction != null)
            return null!;

        _currentTransaction = await Database.BeginTransactionAsync();

        return _currentTransaction;
    }

    public async Task CommitTransactionAsync(IDbContextTransaction transaction)
    {
        if (transaction == null)
            throw new ArgumentNullException(nameof(transaction));
        if (transaction != _currentTransaction)
            throw new InvalidOperationException(
                $"Transaction {transaction.TransactionId} is not current"
            );

        try
        {
            await SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            RollbackTransaction();
            throw;
        }
        finally
        {
            if (_currentTransaction != null)
            {
                _currentTransaction.Dispose();
                _currentTransaction = null;
            }
        }
    }

    public void RollbackTransaction()
    {
        try
        {
            _currentTransaction?.Rollback();
        }
        finally
        {
            if (_currentTransaction != null)
            {
                _currentTransaction.Dispose();
                _currentTransaction = null;
            }
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all configurations from the assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // Global query filters for soft delete
        modelBuilder.Entity<Sneaker>().HasQueryFilter(s => !s.IsDeleted);
        modelBuilder.Entity<Accessory>().HasQueryFilter(a => !a.IsDeleted);

        // Configure PostgreSQL naming conventions (snake_case) will be handled by EFCore.NamingConventions
        // in DbContextRegistration
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Audit trail
        var entries = ChangeTracker.Entries<BaseEntity>();

        foreach (var entry in entries)
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
