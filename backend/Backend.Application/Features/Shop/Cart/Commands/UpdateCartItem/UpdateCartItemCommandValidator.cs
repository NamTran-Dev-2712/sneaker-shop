using FluentValidation;
using Microsoft.EntityFrameworkCore;

public class UpdateCartItemCommandValidator : AbstractValidator<UpdateCartItemCommand>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCartItemCommandValidator(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;

        // Note: CustomerId is set by the controller from JWT token, so we don't validate it here

        RuleFor(x => x.CartItemId)
            .GreaterThan(0)
            .WithMessage("Mã sản phẩm trong giỏ hàng không hợp lệ.")
            .MustAsync(CartItemExistsAsync)
            .WithMessage("Sản phẩm không tồn tại trong giỏ hàng.");

        RuleFor(x => x.Quantity)
            .GreaterThan(0)
            .WithMessage(
                "Số lượng phải lớn hơn 0. Để xóa sản phẩm, vui lòng sử dụng chức năng xóa."
            )
            .LessThanOrEqualTo(100)
            .WithMessage("Số lượng tối đa là 100.");

        // Validate cart item belongs to customer
        RuleFor(x => x)
            .MustAsync(CartItemBelongsToCustomerAsync)
            .WithMessage("Bạn không có quyền chỉnh sửa sản phẩm này.")
            .When(x => x.CartItemId > 0 && x.CustomerId > 0);

        // Optional: Validate new inventory belongs to same sellable item
        RuleFor(x => x)
            .MustAsync(NewInventoryIsValidAsync)
            .WithMessage("Kho hàng mới không hợp lệ cho sản phẩm này.")
            .When(x => x.InventoryId.HasValue && x.InventoryId > 0);
    }

    private async Task<bool> CartItemExistsAsync(
        int cartItemId,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork.CartItems.ExistsAsync(ci => ci.Id == cartItemId);
    }

    private async Task<bool> CartItemBelongsToCustomerAsync(
        UpdateCartItemCommand command,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork
            .CartItems.Query()
            .AsNoTracking()
            .AnyAsync(
                ci => ci.Id == command.CartItemId && ci.Cart.CustomerId == command.CustomerId,
                cancellationToken
            );
    }

    private async Task<bool> NewInventoryIsValidAsync(
        UpdateCartItemCommand command,
        CancellationToken cancellationToken
    )
    {
        if (!command.InventoryId.HasValue)
            return true;

        var cartItem = await _unitOfWork.CartItems.GetByIdAsync(command.CartItemId);
        if (cartItem == null)
            return false;

        return await _unitOfWork.Inventories.ExistsAsync(i =>
            i.Id == command.InventoryId && i.SellableItemId == cartItem.SellableItemId
        );
    }
}
