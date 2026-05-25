public static class MiddlewareRegistration
{
    public static IApplicationBuilder UseCustomMiddlewares(this IApplicationBuilder app)
    {
        app.UseMiddleware<ExceptionMiddleware>();
        // app.UseMiddleware<DbTransactionMiddleware>();
        // app.UseMiddleware<LoggingMiddleware>();
        return app;
    }
}
