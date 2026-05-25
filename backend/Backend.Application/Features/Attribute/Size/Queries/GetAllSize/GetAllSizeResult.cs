public record GetAllSizeResult
{
    public required int Id { get; init; }
    public required string System { get; init; }
    public required decimal Value { get; init; }
    public required int ProductCount { get; init; }
    public required DateTime CreatedAt { get; init; }
}
