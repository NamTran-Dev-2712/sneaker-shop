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

        // Product repositories
        services.AddScoped<ISneakerRepository, SneakerRepository>();
        services.AddScoped<ISneakerColorwayRepository, SneakerColorwayRepository>();
        services.AddScoped<ISneakerVariantRepository, SneakerVariantRepository>();
        services.AddScoped<ISneakerSubImageRepository, SneakerSubImageRepository>();
        services.AddScoped<ISellableItemRepository, SellableItemRepository>();

        return services;
    }
}
