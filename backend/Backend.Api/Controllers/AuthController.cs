using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/auth")]
public class AuthController : BaseController
{
    private readonly ISender _mediator;
    private readonly IConfiguration _configuration;

    public AuthController(ISender mediator, IConfiguration configuration)
    {
        _mediator = mediator;
        _configuration = configuration;
    }

    [HttpPost("register")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Register([FromForm] RegisterCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await _mediator.Send(command);

        // Set HttpOnly cookies for security
        SetAuthCookies(result.AccessToken, result.RefreshToken);

        // Return user info without tokens
        return Ok(
            new
            {
                result.AccountId,
                result.Email,
                result.IsEmailVerified,
                result.Phone,
                result.FullName,
                result.Avatar,
                result.Birthday,
                result.Role,
            }
        );
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // Clear auth cookies
        ClearAuthCookies();
        return Ok(new { message = "Logged out successfully" });
    }

    [HttpGet("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromQuery] string token)
    {
        var command = new VerifyEmailCommand { Token = token };
        var result = await _mediator.Send(command);

        var frontendUrl = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:5173";

        if (result.Success)
        {
            // Redirect to frontend with success message
            var successUrl = $"{frontendUrl}/verify-email/success";
            return Redirect(successUrl);
        }
        else
        {
            // Redirect to frontend with error message
            var errorUrl = $"{frontendUrl}/verify-email/fail";
            return Redirect(errorUrl);
        }
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        // Get refresh token from HttpOnly cookie
        if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
        {
            return Unauthorized("Không tìm thấy refresh token.");
        }

        var command = new RefreshTokenCommand { RefreshToken = refreshToken };
        var result = await _mediator.Send(command);

        // Set new cookies
        SetAuthCookies(result.AccessToken, result.RefreshToken);

        return Ok(new { message = "Tokens refreshed successfully" });
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var accountId = HttpContext.GetAccountId();
        if (accountId == null)
        {
            return Unauthorized("Authentication không hợp lệ.");
        }

        var query = new GetProfileQuery { AccountId = accountId.Value };
        var result = await _mediator.Send(query);

        return Ok(result);
    }

    [Authorize]
    [HttpPut("profile")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileCommand command)
    {
        var accountId = HttpContext.GetAccountId();
        if (accountId == null)
        {
            return Unauthorized("Authentication không hợp lệ.");
        }

        // Ensure user can only update their own profile
        if (command.AccountId != accountId.Value)
        {
            return Forbid("Bạn không có quyền cập nhật profile này.");
        }

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    private void SetAuthCookies(string accessToken, string refreshToken)
    {
        var accessExpirationMinutes = int.Parse(
            _configuration["JwtSettings:AccessExpirationInMinutes"] ?? "60"
        );
        var refreshExpirationDays = int.Parse(
            _configuration["JwtSettings:RefreshExpirationInDays"] ?? "7"
        );

        // Access Token Cookie
        var accessCookieOptions = new CookieOptions
        {
            HttpOnly = true, // Prevent XSS attacks
            Secure = true, // HTTPS only
            SameSite = SameSiteMode.Strict, // Prevent CSRF attacks
            Expires = DateTimeOffset.UtcNow.AddMinutes(accessExpirationMinutes),
            Path = "/",
        };

        Response.Cookies.Append("accessToken", accessToken, accessCookieOptions);

        // Refresh Token Cookie
        var refreshCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(refreshExpirationDays),
            Path = "/",
        };

        Response.Cookies.Append("refreshToken", refreshToken, refreshCookieOptions);
    }

    private void ClearAuthCookies()
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.UtcNow.AddDays(-1),
            Path = "/",
        };

        Response.Cookies.Delete("accessToken", cookieOptions);
        Response.Cookies.Delete("refreshToken", cookieOptions);
    }
}
