using MediatR;

public record GetDetailSellableItemQuery : IRequest<GetDetailSellableItemResult>
{
    public required int Id { get; init; }
}
