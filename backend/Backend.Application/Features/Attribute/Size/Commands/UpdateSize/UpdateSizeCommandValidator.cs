using FluentValidation;

public class UpdateSizeCommandValidator : AbstractValidator<UpdateSizeCommand>
{
    private readonly ISizeRepository _sizeRepository;

    public UpdateSizeCommandValidator(ISizeRepository sizeRepository)
    {
        _sizeRepository = sizeRepository;

        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id không hợp lệ.");

        RuleFor(x => x.System)
            .NotEmpty()
            .WithMessage("Hệ đo size là bắt buộc.")
            .MaximumLength(10)
            .WithMessage("Hệ đo size không được vượt quá 10 ký tự.")
            .Must(s => new[] { "US", "UK", "EU", "CM" }.Contains(s.ToUpper()))
            .WithMessage("Hệ đo size phải là US, UK, EU hoặc CM.");

        RuleFor(x => x.Value)
            .GreaterThan(0)
            .WithMessage("Giá trị size phải lớn hơn 0.")
            .LessThanOrEqualTo(100)
            .WithMessage("Giá trị size không hợp lệ.");

        RuleFor(x => x)
            .MustAsync(
                async (command, cancellation) =>
                    !await _sizeRepository.ExistsBySystemValueAsync(
                        command.System,
                        command.Value,
                        command.Id
                    )
            )
            .WithMessage("Size đã tồn tại trong hệ thống.");
    }
}
