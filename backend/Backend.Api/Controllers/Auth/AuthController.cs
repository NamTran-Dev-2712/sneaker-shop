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
        SetAuthCookies(result.AccessToken, result.RefreshToken, _configuration);

        // Return user info without tokens
        return Ok(
            new
            {
                result.AccountId,
                result.CustomerId,
                result.Email,
                result.IsEmailVerified,
                result.HasPassword,
                result.Phone,
                result.FullName,
                result.Avatar,
                result.Birthday,
                result.Role,
                result.CartItemCount,
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
        SetAuthCookies(result.AccessToken, result.RefreshToken, _configuration);

        return Ok(new { message = "Tokens refreshed successfully" });
    }

    [AllowAnonymous]
    [HttpPost("forgot-password/request-otp")]
    public async Task<IActionResult> RequestPasswordResetOtp(
        [FromBody] RequestPasswordResetOtpCommand command
    )
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("forgot-password/resend-otp")]
    public async Task<IActionResult> ResendPasswordResetOtp(
        [FromBody] RequestPasswordResetOtpCommand command
    )
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("forgot-password/reset")]
    public async Task<IActionResult> ResetPasswordWithOtp(
        [FromBody] ResetPasswordWithOtpCommand command
    )
    {
        var result = await _mediator.Send(command);
        return Ok(result);
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
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileCommand command)
    {
        var accountId = HttpContext.GetAccountId();
        if (accountId == null)
        {
            return Unauthorized("Authentication không hợp lệ.");
        }

        // Override AccountId from JWT to prevent client tampering
        var securedCommand = command with
        {
            AccountId = accountId.Value,
        };

        var result = await _mediator.Send(securedCommand);
        return Ok(result);
    }

    [Authorize]
    [HttpPut("profile/avatar")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateAvatar([FromForm] IFormFile avatar)
    {
        var accountId = HttpContext.GetAccountId();
        if (accountId == null)
        {
            return Unauthorized("Authentication không hợp lệ.");
        }

        var command = new UpdateAvatarCommand { AccountId = accountId.Value, Avatar = avatar };

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [Authorize]
    [HttpPut("password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordCommand command)
    {
        var accountId = HttpContext.GetAccountId();
        if (accountId == null)
        {
            return Unauthorized("Authentication không hợp lệ.");
        }

        var securedCommand = command with { AccountId = accountId.Value };
        var result = await _mediator.Send(securedCommand);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("resend-verification")]
    public async Task<IActionResult> ResendVerificationEmail(CancellationToken cancellationToken)
    {
        var accountId = HttpContext.GetAccountId();
        if (accountId == null)
        {
            return Unauthorized("Authentication không hợp lệ.");
        }

        var command = new ResendVerificationEmailCommand { AccountId = accountId.Value };
        var result = await _mediator.Send(command, cancellationToken);
        return Ok(result);
    }
}
