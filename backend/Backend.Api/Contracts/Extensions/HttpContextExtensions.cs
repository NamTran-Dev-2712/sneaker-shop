using System.Security.Claims;

public static class HttpContextExtensions
{
    public static int? GetAccountId(this HttpContext context)
    {
        var claim = context.User?.FindFirst(ClaimTypes.NameIdentifier);
        if (claim == null || !int.TryParse(claim.Value, out var userId))
            return null;
        return userId;
    }

    public static string? GetAccountEmail(this HttpContext context)
    {
        return context.User?.FindFirst(ClaimTypes.Email)?.Value;
    }

    public static string? GetAccountRole(this HttpContext context)
    {
        return context.User?.FindFirst(ClaimTypes.Role)?.Value;
    }
}
