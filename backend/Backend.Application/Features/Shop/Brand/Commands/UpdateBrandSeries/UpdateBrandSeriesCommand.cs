using MediatR;

public record UpdateBrandSeriesCommand : IRequest<UpdateBrandSeriesResult>
{
    public required int Id { get; init; }
    public required int BrandId { get; init; }
    public required string Name { get; init; }
    public required bool IsActive { get; init; }
}
