using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace Backend.Api;

public static class PresentationRegistration
{
    public static IServiceCollection AddPresentationServices(this IServiceCollection services)
    {
        // 1. register controllers
        services.AddControllers();

        // 2. register swagger/openapi
        services.AddHealthChecks();

        // 3. register CORS policy
        services.AddCors(options =>
        {
            options.AddPolicy(
                "AllowAll",
                policy =>
                {
                    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                }
            );
        });

        return services;
    }
}
