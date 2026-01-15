public record UpdateSneakerResult
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Slug { get; init; }
    public required string MainImage { get; init; }
    public string? Description { get; init; }
    public required bool IsActive { get; init; }
    public required DateTime UpdatedAt { get; init; }

    // Summary of changes made
    public int ColorwaysAdded { get; init; }
    public int VariantsAdded { get; init; }
    public int VariantsUpdated { get; init; }
    public int SubImagesAdded { get; init; }
    public int SubImagesRemoved { get; init; }
}
