# Cloudinary Image Upload Integration

## 📋 Overview

Complete Cloudinary image upload service implemented following Clean Architecture + CQRS pattern.

## 🏗️ Architecture

```
Application Layer (Contracts)
  └─ IImageService.cs - Interface định nghĩa image operations

Infrastructure Layer (Implementation)  
  └─ ImageService.cs - Cloudinary implementation với full validation

API Layer (Endpoints)
  └─ AuthController.Register - Multipart/form-data endpoint
```

## 🔧 Configuration

### appsettings.json
```json
{
  "CloudinarySettings": {
    "CloudName": "your-cloud-name",
    "ApiKey": "your-api-key",
    "ApiSecret": "your-api-secret"
  }
}
```

### Dependency Injection
Service được đăng ký tự động trong `ServiceInfrastructureRegistration`:
```csharp
services.AddScoped<IImageService, ImageService>();
```

## 📝 IImageService Contract

### Methods

#### 1. UploadImageAsync
Upload image to Cloudinary với folder organization.

**Parameters:**
- `IFormFile file` - Image file từ HTTP request
- `string folder` - Folder name trên Cloudinary (e.g., "avatars", "products", "sneakers")

**Returns:** `Task<string>` - Cloudinary secure URL

**Features:**
- Auto quality optimization (`quality: auto`)
- Auto format conversion (`fetch_format: auto`)
- Unique public ID với GUID prefix
- Upload vào folder được chỉ định

**Example:**
```csharp
var avatarUrl = await _imageService.UploadImageAsync(file, "avatars");
// Returns: https://res.cloudinary.com/your-cloud/image/upload/avatars/guid_filename.jpg
```

#### 2. DeleteImageAsync
Xóa image từ Cloudinary by public ID.

**Parameters:**
- `string publicId` - Cloudinary public ID (extract từ URL)

**Returns:** `Task<bool>` - True nếu xóa thành công

**Example:**
```csharp
var publicId = "avatars/guid_filename";
var deleted = await _imageService.DeleteImageAsync(publicId);
```

#### 3. ExtractPublicIdFromUrl
Parse Cloudinary URL để lấy public ID (cần cho delete operation).

**Parameters:**
- `string imageUrl` - Full Cloudinary URL

**Returns:** `string?` - Public ID hoặc null nếu invalid

**Logic:**
- Parse URL segments
- Tìm "upload" segment
- Skip version (vXXXXX)
- Remove file extension
- Join folder structure

**Example:**
```csharp
var url = "https://res.cloudinary.com/cloud/image/upload/v1234/avatars/file.jpg";
var publicId = _imageService.ExtractPublicIdFromUrl(url);
// Returns: "avatars/file"
```

#### 4. ValidateImageAsync
Validate image file trước khi upload (file size, extension, MIME type, magic numbers).

**Parameters:**
- `IFormFile file` - Image file to validate

**Returns:** `Task<bool>` - True nếu valid

**Validation Rules:**
- Max file size: 5MB
- Allowed extensions: `.jpg`, `.jpeg`, `.png`, `.webp`
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`
- Magic number validation cho JPEG/PNG/WebP

**Example:**
```csharp
var isValid = await _imageService.ValidateImageAsync(file);
if (!isValid) throw new ArgumentException("Invalid image file");
```

## 🔐 Security & Validation

### File Size Limit
```csharp
private const long MaxFileSize = 5 * 1024 * 1024; // 5MB
```

### Allowed Formats
```csharp
private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
private static readonly string[] AllowedMimeTypes = { "image/jpeg", "image/png", "image/webp" };
```

### Magic Number Validation
Kiểm tra file header để ensure thực sự là image:
- **JPEG**: `FF D8 FF`
- **PNG**: `89 50 4E 47 0D 0A 1A 0A`
- **WebP**: `RIFF ... WEBP`

## 🎯 Usage Example - Registration with Avatar

### 1. API Endpoint

```csharp
[HttpPost("register")]
[Consumes("multipart/form-data")]
public async Task<IActionResult> Register([FromForm] RegisterCommand command)
{
    var result = await _mediator.Send(command);
    return Ok(result);
}
```

### 2. Command Model

```csharp
public record RegisterCommand : IRequest<RegisterResult>
{
    public required string FullName { get; init; }
    public string? Email { get; init; }
    public required string Phone { get; init; }
    public required string Password { get; init; }
    public string? Birthday { get; init; }
    public IFormFile? Avatar { get; init; } // Optional avatar upload
}
```

### 3. Handler Implementation

```csharp
public async Task<RegisterResult> Handle(RegisterCommand command, CancellationToken cancellationToken)
{
    // 1. Upload avatar if provided
    string? avatarUrl = null;
    if (command.Avatar != null)
    {
        avatarUrl = await _imageService.UploadImageAsync(command.Avatar, "avatars");
    }

    // 2. Create account with avatar URL
    var account = Account.Create(phone, email, passwordHash);
    if (!string.IsNullOrEmpty(avatarUrl))
    {
        account.Avatar = avatarUrl;
    }
    
    // 3. Save to database
    await _authRepository.CreateAccountAsync(account);
    await _unitOfWork.SaveChangesAsync();
    
    return new RegisterResult { AccountId = account.Id, ... };
}
```

### 4. HTTP Request (Postman/Thunder Client)

**Endpoint:** `POST /api/auth/register`

**Content-Type:** `multipart/form-data`

**Form Fields:**
```
FullName: "Tran Nam"
Email: "namtran96hth@gmail.com"
Phone: "+84976290389"
Password: "SecurePass123!"
Birthday: "1996-12-27"
Avatar: [file upload - avatar.jpg]
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -F "FullName=Tran Nam" \
  -F "Email=namtran96hth@gmail.com" \
  -F "Phone=+84976290389" \
  -F "Password=SecurePass123!" \
  -F "Birthday=1996-12-27" \
  -F "Avatar=@/path/to/avatar.jpg"
```

### 5. Response

```json
{
  "accountId": 1,
  "email": "namtran96hth@gmail.com",
  "role": "CUSTOMER"
}
```

**Database Result:**
```sql
SELECT id, email, avatar FROM accounts WHERE id = 1;
-- avatar: https://res.cloudinary.com/your-cloud/image/upload/avatars/guid_avatar.jpg
```

## 📁 Folder Organization

Recommended folder structure trên Cloudinary:

```
your-cloudinary-cloud/
├── avatars/          # User avatars (Account.Avatar)
├── sneakers/         # Sneaker product images
│   ├── main/        # Primary sneaker images
│   └── gallery/     # Additional images
├── accessories/      # Accessory images
└── brands/          # Brand logos
```

**Usage trong code:**
```csharp
// Upload avatar
await _imageService.UploadImageAsync(file, "avatars");

// Upload sneaker main image
await _imageService.UploadImageAsync(file, "sneakers/main");

// Upload brand logo
await _imageService.UploadImageAsync(file, "brands");
```

## ⚠️ Error Handling

### Common Exceptions

1. **File Empty or Null**
```csharp
throw new ArgumentException("File is empty or null.");
```

2. **Invalid Image File**
```csharp
throw new ArgumentException("Invalid image file. Check file type, size, and format.");
```

3. **Cloudinary Upload Failed**
```csharp
throw new Exception($"Cloudinary upload failed: {uploadResult.Error.Message}");
```

4. **Configuration Missing**
```csharp
throw new InvalidOperationException("Cloudinary settings are not configured properly.");
```

### Validation Before Upload

```csharp
if (!await _imageService.ValidateImageAsync(file))
{
    return BadRequest("Invalid image file. Allowed: JPG, PNG, WebP. Max size: 5MB.");
}

try
{
    var url = await _imageService.UploadImageAsync(file, "avatars");
}
catch (Exception ex)
{
    _logger.LogError(ex, "Failed to upload avatar");
    return StatusCode(500, "Image upload failed");
}
```

## 🔄 Future Enhancements

### 1. Image Transformation Support
```csharp
Task<string> UploadImageAsync(IFormFile file, string folder, ImageTransformOptions? options = null);

public class ImageTransformOptions
{
    public int? Width { get; set; }
    public int? Height { get; set; }
    public string? Crop { get; set; } // "fill", "fit", "scale"
    public int? Quality { get; set; } // 1-100
}
```

### 2. Multiple Image Upload
```csharp
Task<List<string>> UploadImagesAsync(IEnumerable<IFormFile> files, string folder);
```

### 3. Image Resize/Thumbnail
```csharp
Task<string> UploadWithThumbnailAsync(IFormFile file, string folder, int thumbnailSize = 150);
```

### 4. Update Avatar Logic
```csharp
public async Task UpdateAvatarAsync(Account account, IFormFile newAvatar)
{
    // Delete old avatar if exists
    if (!string.IsNullOrEmpty(account.Avatar))
    {
        var oldPublicId = _imageService.ExtractPublicIdFromUrl(account.Avatar);
        if (oldPublicId != null)
        {
            await _imageService.DeleteImageAsync(oldPublicId);
        }
    }
    
    // Upload new avatar
    var newUrl = await _imageService.UploadImageAsync(newAvatar, "avatars");
    account.UpdateProfile(account.Email, account.Phone, newUrl);
}
```

## ✅ Clean Architecture Compliance

| Layer | Responsibility | Files |
|-------|---------------|-------|
| **Domain** | Business entities | `Account.Avatar` property |
| **Application** | Use cases & contracts | `IImageService`, `RegisterCommand.Avatar`, `RegisterCommandHandler` |
| **Infrastructure** | External services | `ImageService` (Cloudinary SDK) |
| **API** | HTTP handling | `AuthController.Register` with `[Consumes("multipart/form-data")]` |

**Dependency Flow:**
```
API → Application (IImageService) ← Infrastructure (ImageService)
      ↓
    Domain (Account entity)
```

**✅ No Dependency Violations:**
- Application chỉ depends on IImageService interface
- Domain không biết gì về Cloudinary
- Infrastructure implements contract từ Application

## 🧪 Testing

### Unit Test ImageService

```csharp
[Fact]
public async Task UploadImageAsync_ValidFile_ReturnsUrl()
{
    // Arrange
    var mockFile = CreateMockFile("test.jpg", "image/jpeg", 1024);
    var imageService = new ImageService(_configuration);
    
    // Act
    var url = await imageService.UploadImageAsync(mockFile, "test");
    
    // Assert
    Assert.NotNull(url);
    Assert.Contains("cloudinary.com", url);
}

[Fact]
public async Task ValidateImageAsync_FileTooLarge_ReturnsFalse()
{
    // Arrange
    var mockFile = CreateMockFile("large.jpg", "image/jpeg", 6 * 1024 * 1024); // 6MB
    
    // Act
    var isValid = await _imageService.ValidateImageAsync(mockFile);
    
    // Assert
    Assert.False(isValid);
}
```

### Integration Test Registration with Avatar

```csharp
[Fact]
public async Task Register_WithAvatar_SavesUrlToDatabase()
{
    // Arrange
    var command = new RegisterCommand
    {
        FullName = "Test User",
        Email = "test@example.com",
        Phone = "+84123456789",
        Password = "Password123!",
        Avatar = CreateMockFile("avatar.jpg", "image/jpeg", 2048)
    };
    
    // Act
    var result = await _mediator.Send(command);
    
    // Assert
    var account = await _dbContext.Accounts.FindAsync(result.AccountId);
    Assert.NotNull(account.Avatar);
    Assert.Contains("cloudinary.com", account.Avatar);
}
```

---

## 📚 References

- [CloudinaryDotNet Documentation](https://cloudinary.com/documentation/dotnet_integration)
- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
