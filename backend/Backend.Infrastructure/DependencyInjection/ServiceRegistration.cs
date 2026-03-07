using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using RazorLight;

public static class ServiceInfrastructureRegistration
{
    public static IServiceCollection AddServiceInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IImageService, ImageService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<ISlugService, SlugService>();

        // Register Google OAuth service (uses Google.Apis.Auth library internally)
        services.AddSingleton<IGoogleOAuthService, GoogleOAuthService>();

        // Register RazorLight engine for email templates
        var templatesPath = Path.Combine(AppContext.BaseDirectory, "Templates");
        var razorEngine = new RazorLightEngineBuilder()
            .UseFileSystemProject(templatesPath)
            .UseMemoryCachingProvider()
            .SetOperatingAssembly(typeof(ServiceInfrastructureRegistration).GetTypeInfo().Assembly)
            .Build();
        services.AddSingleton<IRazorLightEngine>(razorEngine);

        services.AddScoped<IMailSender, MailSenderService>();

        // Background email queue (singleton channel + hosted processor)
        services.AddSingleton<EmailJobQueue>();
        services.AddSingleton<IEmailJobQueue>(sp => sp.GetRequiredService<EmailJobQueue>());
        services.AddHostedService<EmailProcessorService>();

        return services;
    }
}
