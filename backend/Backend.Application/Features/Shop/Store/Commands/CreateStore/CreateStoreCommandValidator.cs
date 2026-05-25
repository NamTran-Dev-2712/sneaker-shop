using FluentValidation;

public class CreateStoreCommandValidator : AbstractValidator<CreateStoreCommand>
{
    private readonly IStoreRepository _storeRepository;

    public CreateStoreCommandValidator(IStoreRepository storeRepository)
    {
        _storeRepository = storeRepository;

        RuleFor(x => x.Code)
            .NotEmpty()
            .WithMessage("Mã cửa hàng là bắt buộc.")
            .MaximumLength(20)
            .WithMessage("Mã cửa hàng không được vượt quá 20 ký tự.")
            .Matches(@"^[A-Z0-9_-]+$")
            .WithMessage("Mã cửa hàng chỉ được chứa chữ hoa, số và ký tự _ hoặc -.")
            .MustAsync(
                async (code, cancellation) => !await _storeRepository.ExistsByCodeAsync(code)
            )
            .WithMessage("Mã cửa hàng đã tồn tại.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Tên cửa hàng là bắt buộc.")
            .MaximumLength(200)
            .WithMessage("Tên cửa hàng không được vượt quá 200 ký tự.")
            .MustAsync(
                async (name, cancellation) => !await _storeRepository.ExistsByNameAsync(name)
            )
            .WithMessage("Tên cửa hàng đã tồn tại.");

        RuleFor(x => x.Address)
            .MaximumLength(500)
            .WithMessage("Địa chỉ không được vượt quá 500 ký tự.")
            .When(x => !string.IsNullOrEmpty(x.Address));

        RuleFor(x => x.Phone)
            .Matches(@"^(\+84|0)\d{9,10}$")
            .WithMessage("Số điện thoại không hợp lệ.")
            .When(x => !string.IsNullOrEmpty(x.Phone));
    }
}
