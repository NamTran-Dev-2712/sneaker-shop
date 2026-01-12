using MediatR;

public record CreateBrandSeriesCommand : IRequest<CreateBrandSeriesResult>
{
    public required int BrandId { get; init; }
    public required string Name { get; init; }
}
