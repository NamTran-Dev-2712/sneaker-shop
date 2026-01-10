using Microsoft.AspNetCore.Http;

public interface IImageService
{
    /// <summary>
    /// Upload image to Cloudinary with optional folder
    /// </summary>
    /// <param name="file">Image file to upload</param>
    /// <param name="folder">Folder name in Cloudinary (e.g., "avatars", "products")</param>
    /// <returns>Image URL from Cloudinary</returns>
    Task<string> UploadImageAsync(IFormFile file, string folder);

    /// <summary>
    /// Delete image from Cloudinary by public ID
    /// </summary>
    /// <param name="publicId">Cloudinary public ID (extracted from URL)</param>
    Task<bool> DeleteImageAsync(string publicId);

    /// <summary>
    /// Extract public ID from Cloudinary URL
    /// </summary>
    /// <param name="imageUrl">Full Cloudinary image URL</param>
    /// <returns>Public ID or null if invalid URL</returns>
    string? ExtractPublicIdFromUrl(string imageUrl);

    /// <summary>
    /// Validate image file (type, size, dimensions)
    /// </summary>
    /// <param name="file">Image file to validate</param>
    /// <returns>True if valid, false otherwise</returns>
    Task<bool> ValidateImageAsync(IFormFile file);
}
