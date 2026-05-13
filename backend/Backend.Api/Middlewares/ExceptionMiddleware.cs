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

    public async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        // initial values
        var statusCode = StatusCodes.Status500InternalServerError;
        string message = "An internal server error occurred.";
        List<string>? errors = null;

        // handle specific exceptions
        switch (exception)
        {
            case FluentValidation.ValidationException valEx:
                statusCode = StatusCodes.Status400BadRequest;
                message = "Validation failed.";
                errors = valEx.Errors.Select(e => e.ErrorMessage).ToList(); // Only take Message for easier display on FE
                break;

            case NotFoundException:
                statusCode = StatusCodes.Status404NotFound;
                message = exception.Message; // Example: "The requested resource was not found."
                break;

            case BadException:
                statusCode = StatusCodes.Status400BadRequest;
                message = exception.Message; // Example: "The request was invalid."
                break;

            case UnauthorizedAccessException:
                statusCode = StatusCodes.Status401Unauthorized;
                message = exception.Message; // Example: "Invalid credentials."
                break;

            case UnauthorizedException:
                statusCode = StatusCodes.Status401Unauthorized;
                message = exception.Message; // Example: "Invalid credentials."
                break;

            case ForbiddenException:
                statusCode = StatusCodes.Status403Forbidden;
                message = exception.Message; // Example: "You do not have permission to access this resource."
                break;

            case ConflictException:
                statusCode = StatusCodes.Status409Conflict;
                message = exception.Message;
                break;

            case KeyNotFoundException:
                statusCode = StatusCodes.Status404NotFound;
                message = "The requested resource was not found.";
                break;

            // You can add Custom Exceptions here (e.g., BadRequestException)

            default:
                // Unknown error (500)
                if (_env.IsDevelopment())
                {
                    message = exception.Message;
                    errors = new List<string> { exception.StackTrace ?? "" };
                }
                else
                {
                    message = "A server error occurred. Please try again later.";
                }
                break;
        }

        // 3. Set StatusCode for Response
        context.Response.StatusCode = statusCode;

        // 4. Create Response in your standard format
        var response = ApiResponse<object>.Fail(statusCode, message, errors);

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        };

        await context.Response.WriteAsJsonAsync(response, options);
    }
}
