using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Requests;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

public class GoogleOAuthService : IGoogleOAuthService, IDisposable
{
    private readonly GoogleAuthorizationCodeFlow _flow;
    private readonly ILogger<GoogleOAuthService> _logger;
    private readonly string _clientId;

    public GoogleOAuthService(IConfiguration configuration, ILogger<GoogleOAuthService> logger)
    {
        _logger = logger;

        _clientId =
            configuration["GoogleOAuth:ClientId"]
            ?? throw new InvalidOperationException("GoogleOAuth:ClientId is not configured.");

        var clientSecret =
            configuration["GoogleOAuth:ClientSecret"]
            ?? throw new InvalidOperationException("GoogleOAuth:ClientSecret is not configured.");

        var scope = configuration["GoogleOAuth:Scope"] ?? "openid email profile";

        _flow = new GoogleAuthorizationCodeFlow(
            new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets
                {
                    ClientId = _clientId,
                    ClientSecret = clientSecret,
                },
                Scopes = scope.Split(' '),
            }
        );
    }

    public string GetAuthorizationUrl(string state, string redirectUri)
    {
        var request = _flow.CreateAuthorizationCodeRequest(redirectUri);
        request.State = state;

        // Set Google-specific parameters
        if (request is GoogleAuthorizationCodeRequestUrl googleRequest)
        {
            googleRequest.AccessType = "online";
            googleRequest.Prompt = "select_account";
        }

        return request.Build().ToString();
    }

    public async Task<GoogleTokenResponse> ExchangeCodeForTokenAsync(
        string code,
        string redirectUri
    )
    {
        _logger.LogInformation("Exchanging authorization code for tokens.");

        var tokenResponse = await _flow.ExchangeCodeForTokenAsync(
            string.Empty,
            code,
            redirectUri,
            CancellationToken.None
        );

        if (tokenResponse == null || string.IsNullOrEmpty(tokenResponse.IdToken))
        {
            throw new InvalidOperationException("Invalid token response from Google.");
        }

        _logger.LogInformation("Successfully exchanged authorization code for tokens.");

        return new GoogleTokenResponse
        {
            AccessToken = tokenResponse.AccessToken ?? string.Empty,
            IdToken = tokenResponse.IdToken,
            TokenType = tokenResponse.TokenType ?? "Bearer",
            ExpiresIn = (int)(tokenResponse.ExpiresInSeconds ?? 0),
            Scope = tokenResponse.Scope,
        };
    }

    public async Task<GoogleUserInfo> GetUserInfoFromIdTokenAsync(string idToken)
    {
        // Validate ID token with full cryptographic signature verification
        // via Google's public JWKS keys (handled internally by the library)
        var settings = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new[] { _clientId },
        };

        GoogleJsonWebSignature.Payload payload;
        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
        }
        catch (InvalidJwtException ex)
        {
            _logger.LogWarning(ex, "Google ID token validation failed.");
            throw new InvalidOperationException("Invalid Google ID token.", ex);
        }

        if (string.IsNullOrEmpty(payload.Subject))
        {
            throw new InvalidOperationException("Google ID token missing 'sub' claim.");
        }

        if (string.IsNullOrEmpty(payload.Email))
        {
            throw new InvalidOperationException("Google ID token missing 'email' claim.");
        }

        _logger.LogInformation(
            "Validated and extracted user info from Google ID token. Sub: {Sub}",
            payload.Subject
        );

        return new GoogleUserInfo
        {
            Sub = payload.Subject,
            Email = payload.Email,
            EmailVerified = payload.EmailVerified,
            Name = payload.Name,
            GivenName = payload.GivenName,
            FamilyName = payload.FamilyName,
            Picture = payload.Picture,
        };
    }

    public void Dispose()
    {
        _flow?.Dispose();
        GC.SuppressFinalize(this);
    }
}
