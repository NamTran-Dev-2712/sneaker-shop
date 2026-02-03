using FluentValidation;

public class AddToCartCommandValidator : AbstractValidator<AddToCartCommand>
{
    private readonly IUnitOfWork _unitOfWork;

    public AddToCartCommandValidator(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;

        // Note: CustomerId is set by the controller from JWT token, so we don't validate it here
        // The controller will return Unauthorized if CustomerId is not available

        RuleFor(x => x.SellableItemId)
            .GreaterThan(0)
            .WithMessage("Mã sản phẩm không hợp lệ.")
            .MustAsync(SellableItemExistsAndActiveAsync)
            .WithMessage("Sản phẩm không tồn tại hoặc đã ngừng kinh doanh.");

        RuleFor(x => x.InventoryId)
            .GreaterThan(0)
            .WithMessage("Mã kho không hợp lệ.")
            .MustAsync(InventoryExistsAsync)
            .WithMessage("Kho hàng không tồn tại.");

        RuleFor(x => x.Quantity)
            .GreaterThan(0)
            .WithMessage("Số lượng phải lớn hơn 0.")
            .LessThanOrEqualTo(100)
            .WithMessage("Số lượng tối đa cho mỗi lần thêm là 100.");

        // Cross-field validation: inventory must belong to the sellable item
        RuleFor(x => x)
            .MustAsync(InventoryBelongsToSellableItemAsync)
            .WithMessage("Kho hàng không thuộc sản phẩm này.")
            .When(x => x.SellableItemId > 0 && x.InventoryId > 0);
    }

    private async Task<bool> SellableItemExistsAndActiveAsync(
        int sellableItemId,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork.SellableItems.ExistsAsync(s =>
            s.Id == sellableItemId && s.IsActive
        );
    }

    private async Task<bool> InventoryExistsAsync(
        int inventoryId,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork.Inventories.ExistsAsync(i => i.Id == inventoryId);
    }

    private async Task<bool> InventoryBelongsToSellableItemAsync(
        AddToCartCommand command,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork.Inventories.ExistsAsync(i =>
            i.Id == command.InventoryId && i.SellableItemId == command.SellableItemId
        );
    }
}
