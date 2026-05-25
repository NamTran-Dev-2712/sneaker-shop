using Microsoft.AspNetCore.Http;

public interface IImageService
{
    /// <summary>
    /// Upload image to Cloudinary with optional folder
    /// </summary>
    /// <param name="file">Image file to upload</param>
    /// <param name="folder">Folder name in Cloudinary (e.g., "avatars", "products")</param>
    /// <returns>ImageUploadResult containing URL and PublicId</returns>
    Task<ImageUploadResult> UploadImageAsync(IFormFile file, string folder);

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

    /// <summary>
    /// Replace existing image: delete old and upload new
    /// </summary>
    /// <param name="file">New image file to upload</param>
    /// <param name="folder">Folder name in Cloudinary</param>
    /// <param name="oldPublicId">Public ID of old image to delete</param>
    /// <returns>ImageUploadResult containing new URL and PublicId</returns>
    Task<ImageUploadResult> ReplaceImageAsync(IFormFile file, string folder, string? oldPublicId);
}
