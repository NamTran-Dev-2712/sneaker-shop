using FluentValidation;

public class UpdateSlideCommandValidator : AbstractValidator<UpdateSlideCommand>
{
    private readonly ISlideRepository _slideRepository;

    public UpdateSlideCommandValidator(ISlideRepository slideRepository)
    {
        _slideRepository = slideRepository;

        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id slide không hợp lệ.");

        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Tiêu đề slide là bắt buộc.")
            .MaximumLength(200)
            .WithMessage("Tiêu đề slide không được vượt quá 200 ký tự.")
            .MustAsync(
                async (command, title, cancellation) =>
                    !await _slideRepository.ExistsByTitleAsync(title, command.Id)
            )
            .WithMessage("Tiêu đề slide đã tồn tại.");

        RuleFor(x => x.Subtitle)
            .NotEmpty()
            .WithMessage("Phụ đề slide là bắt buộc.")
            .MaximumLength(200)
            .WithMessage("Phụ đề slide không được vượt quá 200 ký tự.");

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Mô tả slide là bắt buộc.")
            .MaximumLength(500)
            .WithMessage("Mô tả slide không được vượt quá 500 ký tự.");

        RuleFor(x => x.ButtonText)
            .NotEmpty()
            .WithMessage("Text nút là bắt buộc.")
            .MaximumLength(50)
            .WithMessage("Text nút không được vượt quá 50 ký tự.");

        RuleFor(x => x.ButtonUrl)
            .NotEmpty()
            .WithMessage("URL nút là bắt buộc.")
            .MaximumLength(500)
            .WithMessage("URL nút không được vượt quá 500 ký tự.");
    }
}
