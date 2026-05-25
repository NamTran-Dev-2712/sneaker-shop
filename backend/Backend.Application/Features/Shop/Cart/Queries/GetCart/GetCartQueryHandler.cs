using MediatR;
using Microsoft.EntityFrameworkCore;

public class GetCartQueryHandler : IRequestHandler<GetCartQuery, GetCartResult>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetCartQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GetCartResult> Handle(GetCartQuery query, CancellationToken cancellationToken)
    {
        // 1. Get cart with items using optimized query (AsSplitQuery to avoid cartesian explosion)
        var cart = await _unitOfWork.Carts.GetByCustomerIdWithItemsAsync(
            query.CustomerId,
            cancellationToken
        );

        // 2. If no cart exists, return empty cart result
        if (cart == null)
        {
            return new GetCartResult
            {
                CartId = 0,
                CustomerId = query.CustomerId,
                TotalQuantity = 0,
                SubTotal = 0,
                UpdatedAt = DateTime.UtcNow,
                TotalItems = 0,
                TotalPages = 0,
                HasPreviousPage = false,
                HasNextPage = false,
                Items = new List<CartItemDto>(),
            };
        }

        // 3. Get all cart items (sorted by most recent)
        var allItems = cart.Items.OrderByDescending(i => i.UpdatedAt).ToList();
        var totalItems = allItems.Count;
        var totalPages = (int)Math.Ceiling(totalItems / (double)query.PageSize);

        // 4. Calculate total SubTotal for entire cart (not just current page)
        decimal subTotal = 0;
        foreach (var item in allItems)
        {
            var sellableItem = item.SellableItem;
            var unitPrice = sellableItem.OnlinePrice ?? sellableItem.RetailPrice ?? 0;
            subTotal += unitPrice * item.Quantity;
        }

        // 5. Apply pagination
        var paginatedItems = allItems
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToList();

        // 6. Build cart items with full details for current page
        var cartItems = new List<CartItemDto>();

        foreach (var item in paginatedItems)
        {
            var cartItemDto = await BuildCartItemDtoAsync(item, cancellationToken);
            cartItems.Add(cartItemDto);
        }

        // 7. Return complete cart result with pagination
        return new GetCartResult
        {
            CartId = cart.Id,
            CustomerId = cart.CustomerId,
            TotalQuantity = cart.TotalCount,
            SubTotal = subTotal,
            UpdatedAt = cart.UpdatedAt,
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasPreviousPage = query.PageNumber > 1,
            HasNextPage = query.PageNumber < totalPages,
            Items = cartItems,
        };
    }

    private async Task<CartItemDto> BuildCartItemDtoAsync(
        CartItem item,
        CancellationToken cancellationToken
    )
    {
        var sellableItem = item.SellableItem;
        var inventory = item.Inventory;

        // Determine product type and get details
        var isSneaker = sellableItem.Type == SellableType.SNEAKER_VARIANT;
        string productName;
        string? productSlug = null;
        string mainImage;
        string? colorName = null;
        string? colorHex = null;
        string? sizeName = null;
        string? brandName = null;

        if (isSneaker && sellableItem.SneakerVariant != null)
        {
            var variant = sellableItem.SneakerVariant;
            var sneaker = variant.Colorway.Sneaker;
            productName = sneaker.Name;
            productSlug = sneaker.Slug;
            mainImage = variant.Colorway.CoverImage;
            colorName = variant.Colorway.Color.Name;
            colorHex = variant.Colorway.Color.Hex;
            sizeName = $"{variant.Size.System} {variant.Size.Value}";
            brandName = sneaker.Brand?.Name;
        }
        else if (sellableItem.Accessory != null)
        {
            var accessory = sellableItem.Accessory;
            productName = accessory.Name;
            productSlug = accessory.Slug;
            mainImage = accessory.MainImage;
            brandName = accessory.Brand?.Name;
        }
        else
        {
            productName = "Unknown Product";
            mainImage = string.Empty;
        }

        // Get unit price (prefer online price, fallback to retail price)
        var unitPrice = sellableItem.OnlinePrice ?? sellableItem.RetailPrice ?? 0;

        // Get all available inventories for this sellable item
        var allInventories = await _unitOfWork
            .Inventories.Query()
            .AsNoTracking()
            .Include(i => i.Store)
            .Where(i => i.SellableItemId == item.SellableItemId && i.OnHand - i.Reserved > 0)
            .Select(i => new InventoryInfoDto
            {
                InventoryId = i.Id,
                StoreId = i.StoreId,
                StoreName = i.Store.Name,
                OnHand = i.OnHand,
                Reserved = i.Reserved,
                Available = i.OnHand - i.Reserved,
            })
            .ToListAsync(cancellationToken);

        // Calculate total available across all stores
        var totalAvailable = allInventories.Sum(i => i.Available);

        // Get selected inventory info
        var selectedInventory =
            allInventories.FirstOrDefault(i => i.InventoryId == item.InventoryId)
            ?? new InventoryInfoDto
            {
                InventoryId = inventory.Id,
                StoreId = inventory.StoreId,
                StoreName = inventory.Store?.Name ?? "Unknown Store",
                OnHand = inventory.OnHand,
                Reserved = inventory.Reserved,
                Available = inventory.OnHand - inventory.Reserved,
            };

        // Check availability
        bool isAvailable = totalAvailable >= item.Quantity && sellableItem.IsActive;
        string? unavailableReason = null;

        if (!sellableItem.IsActive)
        {
            unavailableReason = "Sản phẩm đã ngừng kinh doanh.";
        }
        else if (totalAvailable == 0)
        {
            unavailableReason = "Sản phẩm tạm hết hàng.";
        }
        else if (totalAvailable < item.Quantity)
        {
            unavailableReason = $"Chỉ còn {totalAvailable} sản phẩm trong kho.";
        }

        return new CartItemDto
        {
            CartItemId = item.Id,
            SellableItemId = item.SellableItemId,
            InventoryId = item.InventoryId,
            Quantity = item.Quantity,
            ProductType = sellableItem.Type,
            ProductName = productName,
            ProductSlug = productSlug,
            Sku = sellableItem.Sku,
            MainImage = mainImage,
            UnitPrice = unitPrice,
            LineTotal = unitPrice * item.Quantity,
            ColorName = colorName,
            ColorHex = colorHex,
            SizeName = sizeName,
            BrandName = brandName,
            SelectedInventory = selectedInventory,
            TotalAvailableAcrossStores = totalAvailable,
            AvailableInventories = allInventories,
            IsAvailable = isAvailable,
            UnavailableReason = unavailableReason,
        };
    }
}
