using FluentValidation;

public class ClearCartCommandValidator : AbstractValidator<ClearCartCommand>
{
    private readonly IUnitOfWork _unitOfWork;

    public ClearCartCommandValidator(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;

        RuleFor(x => x.CustomerId)
            .GreaterThan(0)
            .WithMessage("Mã khách hàng không hợp lệ.")
            .MustAsync(CustomerHasCartAsync)
            .WithMessage("Giỏ hàng không tồn tại.");
    }

    private async Task<bool> CustomerHasCartAsync(
        int customerId,
        CancellationToken cancellationToken
    )
    {
        return await _unitOfWork.Carts.ExistsByCustomerIdAsync(customerId, cancellationToken);
    }
}
