public record GetAllColorResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string Hex { get; init; }
    public required int ProductCount { get; init; }
    public required DateTime CreatedAt { get; init; }
}
