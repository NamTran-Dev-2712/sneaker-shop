using Microsoft.AspNetCore.Mvc;

[ApiController]
public abstract class BaseController : ControllerBase
{
    // Success - 200 OK
    [NonAction]
    public override OkObjectResult Ok(object? value)
    {
        return base.Ok(ApiResponse<object>.Ok(value!));
    }

    // Success but with a custom message
    [NonAction]
    protected OkObjectResult OkCustom(object? data, string message)
    {
        return base.Ok(ApiResponse<object>.Ok(data!, message));
    }

    // Error - 404 Not Found
    [NonAction]
    public override NotFoundObjectResult NotFound(object? value)
    {
        // If value is a string, treat it as the error message
        var message = value as string ?? "Resource not found";
        return base.NotFound(ApiResponse<object>.Fail(404, message));
    }

    // Error - 400 Bad Request
    [NonAction]
    public override BadRequestObjectResult BadRequest(object? error)
    {
        var message = error as string ?? "Bad request";
        return base.BadRequest(ApiResponse<object>.Fail(400, message));
    }

    // Error - 401 Unauthorized
    [NonAction]
    public override UnauthorizedObjectResult Unauthorized(object? value)
    {
        var message = value as string ?? "Unauthorized access";
        return base.Unauthorized(ApiResponse<object>.Fail(401, message));
    }

    // Error - 500 Internal Server Error
    [NonAction]
    protected ObjectResult InternalServerError(string message = "Internal server error")
    {
        var response = ApiResponse<object>.Fail(500, message);
        return StatusCode(500, response);
    }

    // Error - 403 Forbidden
    [NonAction]
    protected ObjectResult Forbidden(string message = "Forbidden")
    {
        var response = ApiResponse<object>.Fail(403, message);
        return StatusCode(403, response);
    }

    // Success - 201 Created
    [NonAction]
    protected CreatedAtActionResult CreatedSuccess(
        string? actionName,
        object? routeValues,
        object? value
    )
    {
        return CreatedAtAction(
            actionName,
            routeValues,
            ApiResponse<object>.Ok(value!, "Tạo thành công")
        );
    }
}
