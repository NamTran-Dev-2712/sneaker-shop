public record CreateColorResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string Hex { get; init; }
    public required DateTime CreatedAt { get; init; }
}
