using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public static class DbContextRegistration
{
    public static IServiceCollection AddDatabaseContext(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options
                .UseNpgsql(
                    connectionString,
                    npgsqlOptions =>
                    {
                        npgsqlOptions.EnableRetryOnFailure(
                            maxRetryCount: 3,
                            maxRetryDelay: TimeSpan.FromSeconds(30),
                            errorCodesToAdd: null
                        );
                        npgsqlOptions.CommandTimeout(30);
                    }
                )
                // Apply snake_case naming convention for PostgreSQL
                .UseSnakeCaseNamingConvention();

            options.EnableSensitiveDataLogging();
            options.EnableDetailedErrors();
        });

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // repositories (not implemented generically)
        services.AddScoped<IAuthRepository, AuthRepository>();
        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IBrandRepository, BrandRepository>();
        services.AddScoped<IBrandSeriesRepository, BrandSeriesRepository>();
        services.AddScoped<IStoreRepository, StoreRepository>();

        // Attribute repositories
        services.AddScoped<IColorRepository, ColorRepository>();
        services.AddScoped<ISizeRepository, SizeRepository>();
        services.AddScoped<ISlideRepository, SlideRepository>();
        services.AddScoped<IExternalAuthProviderRepository, ExternalAuthProviderRepository>();

        // Product repositories
        services.AddScoped<ISneakerRepository, SneakerRepository>();
        services.AddScoped<ISneakerColorwayRepository, SneakerColorwayRepository>();
        services.AddScoped<ISneakerVariantRepository, SneakerVariantRepository>();
        services.AddScoped<ISneakerSubImageRepository, SneakerSubImageRepository>();
        services.AddScoped<ISellableItemRepository, SellableItemRepository>();

        // Accessory repositories
        services.AddScoped<ICategoryAccessoryRepository, CategoryAccessoryRepository>();
        services.AddScoped<IBrandCategoryAccessoryRepository, BrandCategoryAccessoryRepository>();
        services.AddScoped<IAccessoryRepository, AccessoryRepository>();
        services.AddScoped<IAccessoryImageRepository, AccessoryImageRepository>();

        // procurement repositories
        services.AddScoped<IVendorRepository, VendorRepository>();
        services.AddScoped<IVendorPriceRepository, VendorPriceRepository>();
        services.AddScoped<IPurchaseOrderRepository, PurchaseOrderRepository>();
        services.AddScoped<IPurchaseOrderItemRepository, PurchaseOrderItemRepository>();

        // inventory repositories
        services.AddScoped<IInventoryRepository, InventoryRepository>();

        // cart repositories
        services.AddScoped<ICartRepository, CartRepository>();
        services.AddScoped<ICartItemRepository, CartItemRepository>();

        // order repositories
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IOrderItemRepository, OrderItemRepository>();
        services.AddScoped<IPaymentRepository, PaymentRepository>();
        services.AddScoped<IOrderFulfillmentRepository, OrderFulfillmentRepository>();

        return services;
    }
}
