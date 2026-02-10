public record UpdateSlideResult
{
    public required int Id { get; init; }
    public required string Title { get; init; }
    public required string Subtitle { get; init; }
    public required string Description { get; init; }
    public required string ImageUrl { get; init; }
    public required string ButtonText { get; init; }
    public required string ButtonUrl { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
