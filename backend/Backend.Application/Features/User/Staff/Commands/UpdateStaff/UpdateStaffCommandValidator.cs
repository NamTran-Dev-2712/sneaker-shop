using FluentValidation;

public class UpdateStaffCommandValidator : AbstractValidator<UpdateStaffCommand>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateStaffCommandValidator(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;

        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id không hợp lệ.");

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
