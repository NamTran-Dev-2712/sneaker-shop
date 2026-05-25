using System.Security.Claims;

public interface ITokenService
{
    string GenerateAccessToken(IEnumerable<Claim> claims);
    string GenerateRefreshToken(IEnumerable<Claim> claims);
    ClaimsPrincipal? ValidateToken(string token);
    string GenerateEmailVerificationToken(int accountId, string email);
    ClaimsPrincipal? ValidateEmailVerificationToken(string token);
    ClaimsPrincipal? ValidateRefreshToken(string token);
}
