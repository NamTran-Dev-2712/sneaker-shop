using FluentValidation;

public class UpdateColorCommandValidator : AbstractValidator<UpdateColorCommand>
{
    private readonly IColorRepository _colorRepository;

    public UpdateColorCommandValidator(IColorRepository colorRepository)
    {
        _colorRepository = colorRepository;

        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id không hợp lệ.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Tên màu là bắt buộc.")
            .MaximumLength(50)
            .WithMessage("Tên màu không được vượt quá 50 ký tự.")
            .MustAsync(
                async (command, name, cancellation) =>
                    !await _colorRepository.ExistsByNameAsync(name, command.Id)
            )
            .WithMessage("Tên màu đã tồn tại.");

        RuleFor(x => x.Hex)
            .NotEmpty()
            .WithMessage("Mã hex là bắt buộc.")
            .Matches(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
            .WithMessage("Mã hex không hợp lệ. Định dạng: #RRGGBB hoặc #RGB")
            .MustAsync(
                async (command, hex, cancellation) =>
                    !await _colorRepository.ExistsByHexAsync(hex, command.Id)
            )
            .WithMessage("Mã hex đã tồn tại.");
    }
}
