public record GetAccessoryResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string MainImage { get; init; }
    public decimal? BasePrice { get; init; }
    public required AccessoryListCategoryDto Category { get; init; }
    public required AccessoryListBrandDto Brand { get; init; }
    public int ImageCount { get; init; }
    public bool IsActive { get; init; }
    public required DateTime CreatedAt { get; init; }
}

public record AccessoryListCategoryDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
}

public record AccessoryListBrandDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
}
