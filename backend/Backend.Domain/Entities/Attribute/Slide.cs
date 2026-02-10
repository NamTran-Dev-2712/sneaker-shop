public class Slide : BaseEntity
{
    public Slide() { }

    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string ButtonText { get; set; } = string.Empty;
    public string ButtonUrl { get; set; } = string.Empty;

    // Business logic
    public void UpdateInfo(
        string title,
        string subtitle,
        string description,
        string imageUrl,
        string buttonText,
        string buttonUrl
    )
    {
        Title = title;
        Subtitle = subtitle;
        this.description = description;
        ImageUrl = imageUrl;
        ButtonText = buttonText;
        ButtonUrl = buttonUrl;
        UpdatedAt = DateTime.UtcNow;
    }
}
