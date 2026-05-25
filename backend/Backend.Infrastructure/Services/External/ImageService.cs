using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

public class ImageService : IImageService
{
    private readonly Cloudinary _cloudinary;
    private const long MaxFileSize = 5 * 1024 * 1024; // 5MB
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
    private static readonly string[] AllowedMimeTypes = { "image/jpeg", "image/png", "image/webp" };

    public ImageService(IConfiguration configuration)
    {
        var cloudName = configuration["CloudinarySettings:CloudName"];
        var apiKey = configuration["CloudinarySettings:ApiKey"];
        var apiSecret = configuration["CloudinarySettings:ApiSecret"];

        if (
            string.IsNullOrEmpty(cloudName)
            || string.IsNullOrEmpty(apiKey)
            || string.IsNullOrEmpty(apiSecret)
        )
        {
            throw new InvalidOperationException("Cloudinary settings are not configured properly.");
        }

        var cloudinaryAccount = new CloudinaryDotNet.Account(cloudName, apiKey, apiSecret);
        _cloudinary = new Cloudinary(cloudinaryAccount);
    }

    public async Task<ImageUploadResult> UploadImageAsync(IFormFile file, string folder)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty or null.");
        }

        // Validate image
        if (!await ValidateImageAsync(file))
        {
            throw new ArgumentException("Invalid image file. Check file type, size, and format.");
        }

        using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = folder,
            Transformation = new Transformation().Quality("auto").FetchFormat("auto"),
            PublicId = $"{Guid.NewGuid()}_{Path.GetFileNameWithoutExtension(file.FileName)}",
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
        {
            throw new Exception($"Cloudinary upload failed: {uploadResult.Error.Message}");
        }

        return new ImageUploadResult
        {
            Url = uploadResult.SecureUrl.ToString(),
            PublicId = uploadResult.PublicId,
        };
    }

    public async Task<bool> DeleteImageAsync(string publicId)
    {
        if (string.IsNullOrEmpty(publicId))
        {
            return false;
        }

        var deleteParams = new DeletionParams(publicId) { ResourceType = ResourceType.Image };

        var result = await _cloudinary.DestroyAsync(deleteParams);
        return result.Result == "ok";
    }

    public string? ExtractPublicIdFromUrl(string imageUrl)
    {
        if (string.IsNullOrEmpty(imageUrl))
        {
            return null;
        }

        try
        {
            // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{version}/{public_id}.{format}
            var uri = new Uri(imageUrl);
            var segments = uri.AbsolutePath.Split('/');

            // Find "upload" segment index
            var uploadIndex = Array.IndexOf(segments, "upload");
            if (uploadIndex == -1 || uploadIndex >= segments.Length - 1)
            {
                return null;
            }

            // Get segments after "upload" (skip version if present)
            var relevantSegments = segments.Skip(uploadIndex + 1).ToList();

            // Skip version segment if it starts with 'v' followed by numbers
            if (
                relevantSegments.Count > 0
                && relevantSegments[0].StartsWith("v")
                && relevantSegments[0].Length > 1
                && char.IsDigit(relevantSegments[0][1])
            )
            {
                relevantSegments = relevantSegments.Skip(1).ToList();
            }

            // Join remaining segments and remove extension
            var publicIdWithExtension = string.Join("/", relevantSegments);
            var lastDotIndex = publicIdWithExtension.LastIndexOf('.');

            return lastDotIndex > 0
                ? publicIdWithExtension.Substring(0, lastDotIndex)
                : publicIdWithExtension;
        }
        catch
        {
            return null;
        }
    }

    public async Task<bool> ValidateImageAsync(IFormFile file)
    {
        // Check file size
        if (file.Length > MaxFileSize)
        {
            return false;
        }

        // Check extension
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
        {
            return false;
        }

        // Check MIME type
        if (!AllowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
        {
            return false;
        }

        // Validate image format by reading header
        try
        {
            using var stream = file.OpenReadStream();
            var buffer = new byte[8];
            await stream.ReadExactlyAsync(buffer.AsMemory(0, buffer.Length));

            // Check magic numbers for common image formats
            // JPEG: FF D8 FF
            if (buffer[0] == 0xFF && buffer[1] == 0xD8 && buffer[2] == 0xFF)
            {
                return true;
            }

            // PNG: 89 50 4E 47 0D 0A 1A 0A
            if (buffer[0] == 0x89 && buffer[1] == 0x50 && buffer[2] == 0x4E && buffer[3] == 0x47)
            {
                return true;
            }

            // WebP: RIFF ... WEBP
            if (buffer[0] == 0x52 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x46)
            {
                return true;
            }

            return false;
        }
        catch
        {
            return false;
        }
    }

    public async Task<ImageUploadResult> ReplaceImageAsync(
        IFormFile file,
        string folder,
        string? oldPublicId
    )
    {
        // Delete old image if exists
        if (!string.IsNullOrEmpty(oldPublicId))
        {
            await DeleteImageAsync(oldPublicId);
        }

        // Upload new image
        return await UploadImageAsync(file, folder);
    }
}
