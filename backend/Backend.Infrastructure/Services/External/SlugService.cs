using Slugify;

public class SlugService : ISlugService
{
    private readonly ISlugHelper _slugHelper;

    public SlugService()
    {
        _slugHelper = new SlugHelper();
    }

    public string GenerateSlug(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        return _slugHelper.GenerateSlug(text);
    }

    public async Task<string> GenerateUniqueSlugAsync(
        string text,
        Func<string, Task<bool>> existsCheck
    )
    {
        var baseSlug = GenerateSlug(text);
        var slug = baseSlug;
        var counter = 1;

        while (await existsCheck(slug))
        {
            slug = $"{baseSlug}-{counter}";
            counter++;
        }

        return slug;
    }
}
