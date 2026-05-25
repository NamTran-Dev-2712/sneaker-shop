public record UpdateColorResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string Hex { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
