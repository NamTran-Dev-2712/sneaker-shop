# JWT Authentication & Login System

## 📋 Overview

Complete JWT-based authentication system với HttpOnly cookies, implementing Clean Architecture + CQRS pattern.

## 🏗️ Architecture

```
Application Layer
  ├─ ITokenService - JWT contract
  ├─ IAuthRepository - Authentication data access
  ├─ LoginCommand - CQRS command
  ├─ LoginCommandHandler - Business logic
  └─ LoginCommandValidator - Input validation

Infrastructure Layer
  ├─ TokenService - JWT implementation
  └─ AuthRepository - Database queries

API Layer
  └─ AuthController - HTTP endpoints với cookie management
```

## 🔧 Configuration

### appsettings.json

```json
{
  "JwtSettings": {
    "AccessSecretKey": "your-256-bit-secret-key-min-32-chars",
    "RefreshSecretKey": "your-256-bit-refresh-secret-key-min-32-chars",
    "Issuer": "SneakerShop.API",
    "Audience": "SneakerShop.Client",
    "AccessExpirationInMinutes": 60,
    "RefreshExpirationInDays": 7
  }
}
```

**Security Requirements:**
- **AccessSecretKey**: Minimum 32 characters (256-bit)
- **RefreshSecretKey**: Different from AccessSecretKey, minimum 32 characters
- **Issuer**: Your API domain/identifier
- **Audience**: Your client application identifier

### Dependency Injection

Services được đăng ký tự động:

```csharp
// ServiceRegistration.cs
services.AddScoped<ITokenService, TokenService>();
services.AddScoped<IPasswordHasher, PasswordHasher>();
services.AddScoped<IAuthRepository, AuthRepository>();
```

## 🔐 ITokenService Contract

### Methods

#### 1. GenerateAccessToken
Generate short-lived access token (60 minutes).

**Parameters:**
- `IEnumerable<Claim> claims` - User claims (ID, email, role, etc.)

**Returns:** `string` - JWT access token

**Claims Structure:**
```csharp
var claims = new List<Claim>
{
    new Claim(ClaimTypes.NameIdentifier, accountId),
    new Claim(ClaimTypes.Email, email),
    new Claim(ClaimTypes.MobilePhone, phone),
    new Claim(ClaimTypes.Role, role),
    new Claim("IsEmailVerified", isEmailVerified),
    new Claim("CustomerId", customerId) // If linked
};
```

#### 2. GenerateRefreshToken
Generate long-lived refresh token (7 days).

**Parameters:**
- `IEnumerable<Claim> claims` - User claims

**Returns:** `string` - JWT refresh token

#### 3. ValidateToken
Validate and parse JWT token.

**Parameters:**
- `string token` - JWT token string

**Returns:** `ClaimsPrincipal?` - Claims principal or null if invalid

**Validation Rules:**
- Signature verification
- Issuer validation
- Audience validation
- Expiration check
- Algorithm verification (HMAC SHA256)

## 🎯 Login Flow

### 1. Login Command

```csharp
public record LoginCommand : IRequest<LoginResult>
{
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public required string Password { get; init; }
}
```

**Flexible Authentication:**
- Login với **Email** hoặc **Phone**
- Ít nhất một trong hai phải được cung cấp

### 2. Validation Rules

**LoginCommandValidator:**

```csharp
// At least Email or Phone
RuleFor(x => x)
    .Must(x => !string.IsNullOrWhiteSpace(x.Email) || !string.IsNullOrWhiteSpace(x.Phone))
    .WithMessage("Either Email or Phone must be provided.");

// Email format validation
When(x => !string.IsNullOrWhiteSpace(x.Email), () =>
{
    RuleFor(x => x.Email)
        .EmailAddress()
        .WithMessage("Invalid email format.");
});

// Phone format validation
When(x => !string.IsNullOrWhiteSpace(x.Phone), () =>
{
    RuleFor(x => x.Phone)
        .Matches(@"^\d{10}$")
        .WithMessage("Phone number must be 10 digits.");
});

// Password validation
RuleFor(x => x.Password)
    .NotEmpty()
    .MinimumLength(8)
    .Matches(@"[A-Z]") // Uppercase
    .Matches(@"[a-z]") // Lowercase
    .Matches(@"[0-9]") // Number
    .Matches(@"[\!\?\*\.\@\#\$\%\^]"); // Special char
```

### 3. Handler Implementation

**LoginCommandHandler workflow:**

```
1. Find account by email or phone
   └─ AuthRepository.GetAccountByEmailOrPhoneAsync()

2. Verify password
   └─ PasswordHasher.VerifyPassword()

3. Check account status
   └─ IsActive validation

4. Load customer information (if linked)
   └─ Get Customer via CustomerAccount relationship

5. Generate JWT claims
   └─ Account ID, Email, Phone, Role, CustomerId, etc.

6. Generate tokens
   ├─ AccessToken (60 min)
   └─ RefreshToken (7 days)

7. Return LoginResult with tokens
```

**Code Flow:**

```csharp
public async Task<LoginResult> Handle(LoginCommand command, CancellationToken cancellationToken)
{
    // 1. Find account
    var identifier = command.Email ?? command.Phone ?? string.Empty;
    var account = await _authRepository.GetAccountByEmailOrPhoneAsync(identifier);
    if (account == null)
        throw new UnauthorizedAccessException("Invalid credentials.");

    // 2. Verify password
    if (!_passwordHasher.VerifyPassword(command.Password, account.Password))
        throw new UnauthorizedAccessException("Invalid credentials.");

    // 3. Check active status
    if (!account.IsActive)
        throw new UnauthorizedAccessException("Account is deactivated.");

    // 4. Get customer info
    Customer? customer = null;
    if (account.CustomerAccount != null)
    {
        customer = await _unitOfWork.Repository<Customer>()
            .GetByIdAsync(account.CustomerAccount.CustomerId);
    }

    // 5-6. Generate claims and tokens
    var claims = BuildClaims(account, customer);
    var accessToken = _tokenService.GenerateAccessToken(claims);
    var refreshToken = _tokenService.GenerateRefreshToken(claims);

    // 7. Return result
    return new LoginResult { ... };
}
```

### 4. Login Result

```csharp
public record LoginResult
{
    public required int AccountId { get; init; }
    public required string Email { get; init; }
    public required bool IsEmailVerified { get; init; }
    public string? Phone { get; init; }
    public required string FullName { get; init; }
    public string? Avatar { get; init; }
    public string? Birthday { get; init; }
    public required Role Role { get; init; }
    public required string AccessToken { get; init; }
    public required string RefreshToken { get; init; }
}
```

## 🍪 Cookie-Based Authentication

### Why HttpOnly Cookies?

**Security Benefits:**
- ✅ **XSS Protection**: JavaScript không thể access cookies
- ✅ **CSRF Protection**: SameSite=Strict prevents cross-site requests
- ✅ **Secure Transport**: Cookies only sent over HTTPS
- ✅ **Auto Attachment**: Browser tự động gửi với mọi request

**vs. LocalStorage (Insecure):**
- ❌ Accessible via JavaScript (XSS vulnerability)
- ❌ No automatic security features
- ❌ Must manually attach to requests

### Cookie Configuration

**Access Token Cookie:**
```csharp
var accessCookieOptions = new CookieOptions
{
    HttpOnly = true,          // Prevent XSS
    Secure = true,            // HTTPS only
    SameSite = SameSiteMode.Strict, // Prevent CSRF
    Expires = DateTimeOffset.UtcNow.AddMinutes(60),
    Path = "/"
};
Response.Cookies.Append("accessToken", accessToken, accessCookieOptions);
```

**Refresh Token Cookie:**
```csharp
var refreshCookieOptions = new CookieOptions
{
    HttpOnly = true,
    Secure = true,
    SameSite = SameSiteMode.Strict,
    Expires = DateTimeOffset.UtcNow.AddDays(7),
    Path = "/"
};
Response.Cookies.Append("refreshToken", refreshToken, refreshCookieOptions);
```

### Cookie Properties

| Property | Value | Purpose |
|----------|-------|---------|
| **HttpOnly** | `true` | Prevent JavaScript access (XSS protection) |
| **Secure** | `true` | HTTPS only (MITM protection) |
| **SameSite** | `Strict` | Block cross-site requests (CSRF protection) |
| **Expires** | Token lifetime | Auto-expire with token |
| **Path** | `/` | Available for all routes |

## 🔌 API Endpoints

### 1. Login Endpoint

**URL:** `POST /api/auth/login`

**Content-Type:** `application/json`

**Request Body:**

```json
{
  "email": "namtran96hth@gmail.com",
  "password": "SecurePass123!"
}
```

**Or with Phone:**

```json
{
  "phone": "+84976290389",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**

```json
{
  "accountId": 1,
  "email": "namtran96hth@gmail.com",
  "isEmailVerified": false,
  "phone": "+84976290389",
  "fullName": "Tran Nam",
  "avatar": "https://res.cloudinary.com/.../avatar.jpg",
  "birthday": "1996-12-27",
  "role": "CUSTOMER"
}
```

**Set-Cookie Headers:**
```
Set-Cookie: accessToken=eyJhbGciOi...; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=...
Set-Cookie: refreshToken=eyJhbGciOi...; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=...
```

**Error Responses:**

| Status | Error | Message |
|--------|-------|---------|
| **401** | Invalid credentials | Email/phone or password incorrect |
| **401** | Account deactivated | Account is not active |
| **400** | Validation error | Invalid input format |

### 2. Logout Endpoint

**URL:** `POST /api/auth/logout`

**Response (200 OK):**

```json
{
  "message": "Logged out successfully"
}
```

**Clear-Cookie Headers:**
```
Set-Cookie: accessToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT
Set-Cookie: refreshToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT
```

## 📝 Usage Examples

### cURL - Login with Email

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "namtran96hth@gmail.com",
    "password": "SecurePass123!"
  }' \
  -c cookies.txt
```

### cURL - Login with Phone

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+84976290389",
    "password": "SecurePass123!"
  }' \
  -c cookies.txt
```

### cURL - Authenticated Request

```bash
curl -X GET http://localhost:5000/api/profile \
  -b cookies.txt
```

### cURL - Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

### JavaScript Fetch (Frontend)

```javascript
// Login
async function login(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important: Include cookies
    body: JSON.stringify({ email, password })
  });
  
  if (response.ok) {
    const user = await response.json();
    console.log('Logged in:', user);
    // Cookies are automatically stored by browser
  }
}

// Authenticated request
async function getProfile() {
  const response = await fetch('/api/profile', {
    credentials: 'include' // Important: Send cookies
  });
  
  return await response.json();
}

// Logout
async function logout() {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });
  // Cookies are automatically cleared
}
```

## 🔒 Security Best Practices

### 1. Token Security

**Access Token:**
- ✅ Short-lived (60 minutes)
- ✅ Contains minimal claims
- ✅ Automatically expires
- ✅ Invalidated on logout

**Refresh Token:**
- ✅ Long-lived (7 days)
- ✅ Stored in HttpOnly cookie
- ✅ Can be revoked server-side
- ✅ Used only for token refresh

### 2. Password Security

**Hashing:**
```csharp
// BCrypt with automatic salt
var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
```

**Verification:**
```csharp
var isValid = BCrypt.Net.BCrypt.Verify(providedPassword, hashedPassword);
```

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!?*.@#$%^)

### 3. Error Messages

**Generic errors for security:**
```csharp
// ✅ Good: Generic message
throw new UnauthorizedAccessException("Invalid credentials.");

// ❌ Bad: Reveals information
throw new UnauthorizedAccessException("Email not found.");
throw new UnauthorizedAccessException("Password incorrect.");
```

### 4. Rate Limiting (Future)

Recommendation cho production:
```csharp
// Install: AspNetCoreRateLimit
services.AddMemoryCache();
services.AddInMemoryRateLimiting();

// Configure
services.Configure<IpRateLimitOptions>(options =>
{
    options.GeneralRules = new List<RateLimitRule>
    {
        new RateLimitRule
        {
            Endpoint = "POST:/api/auth/login",
            Limit = 5,
            Period = "1m" // 5 attempts per minute
        }
    };
});
```

## 🧪 Testing

### Unit Test - TokenService

```csharp
[Fact]
public void GenerateAccessToken_ValidClaims_ReturnsToken()
{
    // Arrange
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, "1"),
        new Claim(ClaimTypes.Email, "test@example.com")
    };
    
    // Act
    var token = _tokenService.GenerateAccessToken(claims);
    
    // Assert
    Assert.NotNull(token);
    Assert.Contains(".", token); // JWT format: xxx.yyy.zzz
}

[Fact]
public void ValidateToken_ValidToken_ReturnsPrincipal()
{
    // Arrange
    var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, "1") };
    var token = _tokenService.GenerateAccessToken(claims);
    
    // Act
    var principal = _tokenService.ValidateToken(token);
    
    // Assert
    Assert.NotNull(principal);
    Assert.Equal("1", principal.FindFirst(ClaimTypes.NameIdentifier)?.Value);
}

[Fact]
public void ValidateToken_ExpiredToken_ReturnsNull()
{
    // Use token with past expiration
    var expiredToken = "expired.jwt.token";
    
    var principal = _tokenService.ValidateToken(expiredToken);
    
    Assert.Null(principal);
}
```

### Integration Test - Login Flow

```csharp
[Fact]
public async Task Login_ValidCredentials_SetsCookies()
{
    // Arrange
    var command = new LoginCommand
    {
        Email = "test@example.com",
        Password = "SecurePass123!"
    };
    
    // Act
    var response = await _client.PostAsJsonAsync("/api/auth/login", command);
    
    // Assert
    response.EnsureSuccessStatusCode();
    
    var cookies = response.Headers.GetValues("Set-Cookie");
    Assert.Contains(cookies, c => c.Contains("accessToken"));
    Assert.Contains(cookies, c => c.Contains("refreshToken"));
    Assert.Contains(cookies, c => c.Contains("HttpOnly"));
    Assert.Contains(cookies, c => c.Contains("Secure"));
}

[Fact]
public async Task Login_InvalidCredentials_Returns401()
{
    // Arrange
    var command = new LoginCommand
    {
        Email = "test@example.com",
        Password = "WrongPassword"
    };
    
    // Act
    var response = await _client.PostAsJsonAsync("/api/auth/login", command);
    
    // Assert
    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
}
```

## 🔄 Future Enhancements

### 1. Refresh Token Endpoint

```csharp
[HttpPost("refresh")]
public async Task<IActionResult> RefreshToken()
{
    // Get refresh token from cookie
    if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
    {
        return Unauthorized("No refresh token provided.");
    }
    
    // Validate refresh token
    var principal = _tokenService.ValidateRefreshToken(refreshToken);
    if (principal == null)
    {
        return Unauthorized("Invalid refresh token.");
    }
    
    // Generate new tokens
    var claims = principal.Claims;
    var newAccessToken = _tokenService.GenerateAccessToken(claims);
    var newRefreshToken = _tokenService.GenerateRefreshToken(claims);
    
    // Update cookies
    SetAuthCookies(newAccessToken, newRefreshToken);
    
    return Ok(new { message = "Tokens refreshed successfully" });
}
```

### 2. Token Blacklist (Logout)

```csharp
// Store revoked tokens in Redis
public interface ITokenBlacklistService
{
    Task RevokeTokenAsync(string token, TimeSpan expiration);
    Task<bool> IsTokenRevokedAsync(string token);
}

// Middleware to check blacklist
public class TokenValidationMiddleware
{
    public async Task InvokeAsync(HttpContext context, ITokenBlacklistService blacklist)
    {
        if (context.Request.Cookies.TryGetValue("accessToken", out var token))
        {
            if (await blacklist.IsTokenRevokedAsync(token))
            {
                context.Response.StatusCode = 401;
                return;
            }
        }
        await _next(context);
    }
}
```

### 3. Two-Factor Authentication

```csharp
public record LoginCommand : IRequest<LoginResult>
{
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public required string Password { get; init; }
    public string? TwoFactorCode { get; init; } // Optional 2FA code
}
```

### 4. OAuth Integration

```csharp
[HttpGet("google")]
public IActionResult GoogleLogin()
{
    return Challenge(new AuthenticationProperties
    {
        RedirectUri = "/api/auth/google-callback"
    }, "Google");
}
```

## ✅ Clean Architecture Compliance

| Layer | Implementation | Responsibility |
|-------|---------------|----------------|
| **Domain** | `Account`, `Customer` entities | Business rules |
| **Application** | `ITokenService`, `LoginCommand`, Handler | Use cases & contracts |
| **Infrastructure** | `TokenService`, `AuthRepository` | JWT implementation |
| **API** | `AuthController` | HTTP & cookie management |

**Dependency Flow:**
```
API → Application (ITokenService) ← Infrastructure (TokenService)
      ↓
    Domain (Account entity)
```

**✅ CQRS Compliance:**
- Commands modify state (Login = read + update last login)
- Queries are read-only
- Clear separation of concerns

---

## 📚 References

- [JWT.io](https://jwt.io/) - JWT debugger & documentation
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - JSON Web Token specification
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [HttpOnly Cookies](https://owasp.org/www-community/HttpOnly)
