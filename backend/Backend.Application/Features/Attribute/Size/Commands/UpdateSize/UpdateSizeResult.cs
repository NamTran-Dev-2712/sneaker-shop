public record UpdateSizeResult
{
    public required int Id { get; init; }
    public required string System { get; init; }
    public required decimal Value { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
