using FluentValidation;

public class UpdateStoreCommandValidator : AbstractValidator<UpdateStoreCommand>
{
    private readonly IStoreRepository _storeRepository;

    public UpdateStoreCommandValidator(IStoreRepository storeRepository)
    {
        _storeRepository = storeRepository;

        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id không hợp lệ.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Tên cửa hàng là bắt buộc.")
            .MaximumLength(200)
            .WithMessage("Tên cửa hàng không được vượt quá 200 ký tự.")
            .MustAsync(
                async (command, name, cancellation) =>
                    !await _storeRepository.ExistsByNameAsync(name, command.Id)
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
