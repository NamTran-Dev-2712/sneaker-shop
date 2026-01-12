public interface ISlugService
{
    string GenerateSlug(string text);
    Task<string> GenerateUniqueSlugAsync(string text, Func<string, Task<bool>> existsCheck);
}
