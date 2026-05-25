using FluentValidation;

public class CreateStaffCommandValidator : AbstractValidator<CreateStaffCommand>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateStaffCommandValidator(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;

        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email là bắt buộc.")
            .EmailAddress()
            .WithMessage("Email không hợp lệ.")
            .MaximumLength(255)
            .WithMessage("Email không được vượt quá 255 ký tự.");

        RuleFor(x => x.Phone)
            .NotEmpty()
            .WithMessage("Số điện thoại là bắt buộc.")
            .Matches(@"^(\+84|0)\d{9,10}$")
            .WithMessage("Số điện thoại không hợp lệ.");

        RuleFor(x => x.FullName)
            .NotEmpty()
            .WithMessage("Họ và tên là bắt buộc.")
            .MaximumLength(200)
            .WithMessage("Họ và tên không được vượt quá 200 ký tự.");

        RuleFor(x => x.StoreId)
            .GreaterThan(0)
            .WithMessage("Cửa hàng là bắt buộc.")
            .MustAsync(
                async (storeId, cancellation) =>
                {
                    var store = await _unitOfWork.Stores.GetByIdAsync(storeId, cancellation);
                    return store != null && store.IsActive && !store.IsDeleted;
                }
            )
            .WithMessage("Cửa hàng không tồn tại hoặc đã bị vô hiệu hóa.");
    }
}
