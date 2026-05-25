using FluentValidation;
using Microsoft.EntityFrameworkCore;

public class RemoveItemCartValidator : AbstractValidator<RemoveItemCartCommand>
{
    private readonly IUnitOfWork _unitOfWork;

    public RemoveItemCartValidator(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;

        RuleFor(x => x.CustomerId).GreaterThan(0).WithMessage("Mã khách hàng không hợp lệ.");

        RuleFor(x => x.CartItemId)
            .GreaterThan(0)
            .WithMessage("Mã sản phẩm trong giỏ hàng không hợp lệ.")
            .MustAsync(CartItemExistsAsync)
            .WithMessage("Sản phẩm không tồn tại trong giỏ hàng.");

        // Validate cart item belongs to customer
        RuleFor(x => x)
            .MustAsync(CartItemBelongsToCustomerAsync)
            .WithMessage("Bạn không có quyền xóa sản phẩm này.")
            .When(x => x.CartItemId > 0 && x.CustomerId > 0);
    }

    private async Task<bool> CartItemExistsAsync(
        int cartItemId,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork.CartItems.ExistsAsync(ci => ci.Id == cartItemId);
    }

    private async Task<bool> CartItemBelongsToCustomerAsync(
        RemoveItemCartCommand command,
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
}
