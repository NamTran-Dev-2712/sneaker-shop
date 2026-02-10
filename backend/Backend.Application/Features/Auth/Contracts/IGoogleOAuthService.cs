public interface IGoogleOAuthService
{
    string GetAuthorizationUrl(string state, string redirectUri);
    Task<GoogleTokenResponse> ExchangeCodeForTokenAsync(string code, string redirectUri);
    Task<GoogleUserInfo> GetUserInfoFromIdTokenAsync(string idToken);
}
