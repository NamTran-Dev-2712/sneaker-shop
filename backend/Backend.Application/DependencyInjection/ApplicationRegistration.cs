using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

public static class ServiceApplicationRegistration
{
    public static IServiceCollection AddServiceApplication(this IServiceCollection services)
    {
        var assembly = typeof(ServiceApplicationRegistration).Assembly;

        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(assembly);

            cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        services.AddValidatorsFromAssembly(assembly);

        return services;
    }
}
