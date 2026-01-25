public record DeleteCategoryAccessoryResult
{
    public required int Id { get; init; }
    public required string Message { get; init; }
    public int BrandsDeleted { get; init; }
}
