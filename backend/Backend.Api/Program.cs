using Backend.Api;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDatabaseContext(builder.Configuration);

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder
    .Services.AddOpenApiDocumentation()
    .AddPresentationServices(builder.Configuration)
    .AddServiceInfrastructure()
    .AddServiceApplication();

var app = builder.Build();

if (app.Environment.IsProduction())
{
    app.UseCors("Restricted");
}
else
{
    app.UseCors("Development");
}

// Configure the HTTP request pipeline.
app.UseOpenApiDocumentation();

// run if production
// app.UseHttpsRedirection();

app.UseRouting();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Custom middlewares
app.UseCustomMiddlewares();

// health checks
app.MapHealthChecks("/health");

app.MapControllers();

app.Run();
