using FluentValidation;

public class CreateSlideCommandValidator : AbstractValidator<CreateSlideCommand>
{
    private readonly ISlideRepository _slideRepository;

    public CreateSlideCommandValidator(ISlideRepository slideRepository)
    {
        _slideRepository = slideRepository;

        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Tiêu đề slide là bắt buộc.")
            .MaximumLength(200)
            .WithMessage("Tiêu đề slide không được vượt quá 200 ký tự.")
            .MustAsync(
                async (title, cancellation) => !await _slideRepository.ExistsByTitleAsync(title)
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

        RuleFor(x => x.Image).NotNull().WithMessage("Ảnh slide là bắt buộc.");

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
