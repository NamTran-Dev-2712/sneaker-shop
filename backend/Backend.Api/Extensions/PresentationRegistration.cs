using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
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

        // Rate limiting — protects state-transition endpoints from concurrent abuse
        services.AddRateLimiter(options =>
        {
            options.AddSlidingWindowLimiter(
                "staff-mutations",
                opt =>
                {
                    opt.PermitLimit = 10;
                    opt.Window = TimeSpan.FromSeconds(10);
                    opt.SegmentsPerWindow = 5;
                    opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                    opt.QueueLimit = 0; // reject immediately — no queuing
                }
            );

            options.OnRejected = async (ctx, ct) =>
            {
                ctx.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                ctx.HttpContext.Response.Headers.RetryAfter = "10";
                await ctx.HttpContext.Response.WriteAsJsonAsync(
                    new
                    {
                        success = false,
                        statusCode = 429,
                        message = "Quá nhiều yêu cầu. Vui lòng thử lại sau.",
                    },
                    ct
                );
            };
        });

        return services;
    }
}
