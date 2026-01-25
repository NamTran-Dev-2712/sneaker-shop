using MediatR;

public class GetSellableItemQuery : BaseGetRequest, IRequest<BaseGetResponse<GetSellableItemResult>>
{
    public int? StoreId { get; set; } // Lọc theo cửa hàng có tồn kho
    public SellableType? Type { get; set; } // Lọc theo loại (SNEAKER_VARIANT / ACCESSORY)
    public bool? IsActive { get; set; } // Lọc theo trạng thái active
    public int? BrandId { get; set; } // Lọc theo thương hiệu
    public int? CategoryId { get; set; } // Lọc theo danh mục (cho accessory)
    public bool? HasInventory { get; set; } // Lọc những sản phẩm có tồn kho > 0
    public string? SortBy { get; set; } // sku, name, retailPrice, onlinePrice, createdAt
    public bool IsSortDescending { get; set; } = false;
}
