using MediatR;

public record DeleteBrandSeriesCommand : IRequest<DeleteBrandSeriesResult>
{
    public required int Id { get; init; }
    public required int BrandId { get; init; }
}
