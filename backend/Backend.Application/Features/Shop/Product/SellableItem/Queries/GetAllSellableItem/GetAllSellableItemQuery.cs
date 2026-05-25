using MediatR;

public record GetAllSellableItemQuery : IRequest<List<GetAllSellableItemResult>>
{
    public SellableType? Type { get; init; }
    public bool? IsActive { get; init; }
    public int? BrandId { get; init; }
    public string? Search { get; init; }
}
