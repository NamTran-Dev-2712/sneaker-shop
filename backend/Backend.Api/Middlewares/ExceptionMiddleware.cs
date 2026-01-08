using System.Text.Json;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger,
        IHostEnvironment env
    )
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        // 1. determine status code
        var statusCode = exception switch
        {
            FluentValidation.ValidationException => StatusCodes.Status400BadRequest, // 400 Bad Request for validation errors
            UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
            KeyNotFoundException => StatusCodes.Status404NotFound,
            _ => StatusCodes.Status500InternalServerError,
        };

        context.Response.StatusCode = statusCode;

        // Handle different exception types
        string message = "An internal server error occurred.";
        List<string>? errors = null;

        if (exception is FluentValidation.ValidationException validationException)
        {
            message = "Validation failed.";
            // get all validation errors
            errors = validationException
                .Errors.Select(e => $"{e.PropertyName}: {e.ErrorMessage}")
                .ToList();
        }
        else if (_env.IsDevelopment())
        {
            message = exception.Message;
            errors = new List<string> { exception.StackTrace ?? "" };
        }

        // 3. Create response according to your ApiResponse format
        var response = ApiResponse<object>.Fail(
            statusCode,
            message,
            errors // Return specific error list instead of StackTrace if it's a Validation error
        );

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        };

        await context.Response.WriteAsJsonAsync(response, options);
    }
}
