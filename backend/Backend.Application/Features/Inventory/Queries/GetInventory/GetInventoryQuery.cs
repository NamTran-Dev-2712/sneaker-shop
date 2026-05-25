using MediatR;

public class GetInventoryQuery : BaseGetRequest, IRequest<BaseGetResponse<GetInventoryResult>>
{
    public int? StoreId { get; set; }
    public int? SellableItemId { get; set; }
    public SellableType? SellableType { get; set; }
    public bool? LowStock { get; set; } // Filter items with OnHand - Reserved <= threshold
    public int LowStockThreshold { get; set; } = 10;
    public string? SortBy { get; set; }
    public bool IsSortDescending { get; set; } = true;
}
