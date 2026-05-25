using System.Text.Json;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/auth/google")]
public class GoogleAuthController : BaseController
{
    private readonly ISender _mediator;
    private readonly IConfiguration _configuration;
    private readonly IGoogleOAuthService _googleOAuthService;
    private readonly IDataProtector _dataProtector;
    private readonly ILogger<GoogleAuthController> _logger;

    private const string OAuthStateCookieName = "oauth_state";
    private const int StateExpirationMinutes = 10;

    public GoogleAuthController(
        ISender mediator,
        IConfiguration configuration,
        IGoogleOAuthService googleOAuthService,
        IDataProtectionProvider dataProtectionProvider,
        ILogger<GoogleAuthController> logger
    )
    {
        _mediator = mediator;
        _configuration = configuration;
        _googleOAuthService = googleOAuthService;
        _dataProtector = dataProtectionProvider.CreateProtector("GoogleOAuth.State");
        _logger = logger;
    }

    /// <summary>
    /// Start Google OAuth flow. Redirects user to Google consent screen.
    /// </summary>
    [HttpGet("start")]
    public IActionResult Start([FromQuery] string? returnUrl)
    {
        // Validate returnUrl (prevent open redirect)
        var safeReturnUrl = IsValidReturnUrl(returnUrl) ? returnUrl! : "/";

        // Generate state (anti-CSRF)
        var state = Guid.NewGuid().ToString("N");

        // Create state payload and encrypt
        var statePayload = new OAuthStatePayload
        {
            State = state,
            ReturnUrl = safeReturnUrl,
            CreatedAt = DateTime.UtcNow,
        };

        var stateJson = JsonSerializer.Serialize(statePayload);
        var encryptedState = _dataProtector.Protect(stateJson);

        // Set state in signed HttpOnly cookie (SameSite=Lax for cross-site redirect)
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Lax, // Must be Lax for OAuth redirects
            MaxAge = TimeSpan.FromMinutes(StateExpirationMinutes),
            Path = "/",
        };

        Response.Cookies.Append(OAuthStateCookieName, encryptedState, cookieOptions);

        // Build redirect URI for Google callback
        var redirectUri = GetCallbackUrl();

        // Build Google authorization URL
        var authUrl = _googleOAuthService.GetAuthorizationUrl(state, redirectUri);

        _logger.LogInformation("Starting Google OAuth flow. Redirecting to Google.");

        return Redirect(authUrl);
    }

    /// <summary>
    /// Google OAuth callback. Handles the authorization code exchange.
    /// </summary>
    [HttpGet("callback")]
    public async Task<IActionResult> Callback(
        [FromQuery] string? code,
        [FromQuery] string? state,
        [FromQuery] string? error
    )
    {
        var frontendUrl = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:5173";

        try
        {
            // Handle Google error (user denied consent)
            if (!string.IsNullOrEmpty(error))
            {
                _logger.LogWarning("Google OAuth error: {Error}", error);
                return Redirect($"{frontendUrl}/login?error=google_{error}");
            }

            // Validate code presence
            if (string.IsNullOrEmpty(code))
            {
                _logger.LogWarning("Google OAuth callback missing authorization code.");
                return Redirect($"{frontendUrl}/login?error=missing_code");
            }

            // Validate state (anti-CSRF)
            if (string.IsNullOrEmpty(state))
            {
                _logger.LogWarning("Google OAuth callback missing state parameter.");
                return Redirect($"{frontendUrl}/login?error=invalid_state");
            }

            // Read and validate state cookie
            if (!Request.Cookies.TryGetValue(OAuthStateCookieName, out var encryptedStateCookie))
            {
                _logger.LogWarning("Google OAuth callback: state cookie not found.");
                return Redirect($"{frontendUrl}/login?error=session_expired");
            }

            OAuthStatePayload statePayload;
            try
            {
                var stateJson = _dataProtector.Unprotect(encryptedStateCookie);
                statePayload = JsonSerializer.Deserialize<OAuthStatePayload>(stateJson)!;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(
                    ex,
                    "Google OAuth callback: failed to decrypt/deserialize state cookie."
                );
                return Redirect($"{frontendUrl}/login?error=invalid_state");
            }

            // Validate state matches (anti-CSRF)
            if (statePayload.State != state)
            {
                _logger.LogWarning(
                    "Google OAuth callback: state mismatch. Expected {Expected}, got {Actual}",
                    statePayload.State,
                    state
                );
                return Redirect($"{frontendUrl}/login?error=invalid_state");
            }

            // Validate state not expired
            if (statePayload.CreatedAt < DateTime.UtcNow.AddMinutes(-StateExpirationMinutes))
            {
                _logger.LogWarning("Google OAuth callback: state cookie expired.");
                return Redirect($"{frontendUrl}/login?error=session_expired");
            }

            // Delete state cookie
            Response.Cookies.Delete(
                OAuthStateCookieName,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Lax,
                    Path = "/",
                }
            );

            // Exchange code using CQRS command
            var command = new GoogleLoginCommand { Code = code, RedirectUri = GetCallbackUrl() };

            var result = await _mediator.Send(command);

            // Set auth cookies with SameSite=Lax for cross-origin OAuth redirect
            SetAuthCookiesForOAuth(result.AccessToken, result.RefreshToken, _configuration);

            // Validate returnUrl again (defense in depth)
            var returnUrl = IsValidReturnUrl(statePayload.ReturnUrl) ? statePayload.ReturnUrl : "/";

            _logger.LogInformation(
                "Google OAuth login successful. AccountId: {AccountId}, IsNewUser: {IsNewUser}",
                result.AccountId,
                result.IsNewUser
            );

            // Redirect to target page with oauth_success flag
            // FE will detect this param and refresh once to load user info
            var separator = returnUrl.Contains('?') ? '&' : '?';
            return Redirect($"{frontendUrl}{returnUrl}{separator}oauth_success=true");
        }
        catch (UnauthorizedException ex)
        {
            _logger.LogWarning(ex, "Google OAuth unauthorized: {Message}", ex.Message);
            return Redirect(
                $"{frontendUrl}/login?error=unauthorized&message={Uri.EscapeDataString(ex.Message)}"
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Google OAuth callback failed.");
            return Redirect($"{frontendUrl}/login?error=oauth_failed");
        }
    }

    private string GetCallbackUrl()
    {
        var baseUrl = _configuration["AppSettings:BaseUrl"] ?? "http://localhost:5012";
        return $"{baseUrl}/api/auth/google/callback";
    }

    private static bool IsValidReturnUrl(string? returnUrl)
    {
        if (string.IsNullOrWhiteSpace(returnUrl))
            return false;

        // Must start with / but not //
        if (!returnUrl.StartsWith('/') || returnUrl.StartsWith("//"))
            return false;

        // No protocol injection
        if (returnUrl.Contains("://"))
            return false;

        return true;
    }

    private class OAuthStatePayload
    {
        public string State { get; set; } = string.Empty;
        public string ReturnUrl { get; set; } = "/";
        public DateTime CreatedAt { get; set; }
    }
}
