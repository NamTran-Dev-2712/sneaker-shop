using Microsoft.Extensions.DependencyInjection;

public static class ServiceInfrastructureRegistration
{
    public static IServiceCollection AddServiceInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IPasswordHasher, PasswordHasher>();

        return services;
    }
}
