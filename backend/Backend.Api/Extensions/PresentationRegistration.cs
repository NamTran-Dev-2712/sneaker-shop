using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Api;

public static class PresentationRegistration
{
    public static IServiceCollection AddPresentationServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        // 1. register controllers with JSON options
        services
            .AddControllers()
            .AddJsonOptions(options =>
            {
                // Serialize enums as strings instead of numbers
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

        // 2. register swagger/openapi
        services.AddHealthChecks();

        // 3. register CORS policy
        var allowedOrigins = configuration["AllowOrigins"]
            ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        services.AddCors(options =>
        {
            options.AddPolicy(
                "Restricted",
                policy =>
                {
                    policy
                        .WithOrigins(allowedOrigins ?? Array.Empty<string>())
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                }
            );
        });

        services.AddCors(options =>
        {
            options.AddPolicy(
                "Development",
                policy =>
                {
                    policy
                        .WithOrigins(allowedOrigins ?? Array.Empty<string>())
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                }
            );
        });

        // 4. register JWT Authentication
        var jwtSettings = configuration.GetSection("JwtSettings");
        var accessSecretKey =
            jwtSettings["AccessSecretKey"]
            ?? throw new InvalidOperationException("JWT AccessSecretKey is not configured.");

        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(accessSecretKey)
                    ),
                    ValidateIssuer = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidateAudience = true,
                    ValidAudience = jwtSettings["Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                };

                // Read token from HttpOnly cookie instead of Authorization header
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        context.Token = context.Request.Cookies["accessToken"];
                        return Task.CompletedTask;
                    },
                };
            });

        services.AddAuthorization();

        return services;
    }
}
