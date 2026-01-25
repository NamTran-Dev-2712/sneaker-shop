using MediatR;

public record GetVendorSellableItemsQuery : IRequest<BaseGetResponse<VendorSellableItemResult>>
{
    public required int VendorId { get; init; }
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 10;
    public string? Search { get; init; }
    public SellableType? ProductType { get; init; } // Filter by SNEAKER_VARIANT or ACCESSORY
    public bool? IsCurrentlyEffective { get; init; } // Filter by currently effective prices
    public string SortBy { get; init; } = "sku";
    public string SortOrder { get; init; } = global::SortOrder.ASC;
}
