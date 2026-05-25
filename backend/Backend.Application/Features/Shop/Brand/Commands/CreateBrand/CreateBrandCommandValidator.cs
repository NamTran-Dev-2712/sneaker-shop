using FluentValidation;

public class CreateBrandCommandValidator : AbstractValidator<CreateBrandCommand>
{
    private readonly IBrandRepository _brandRepository;

    public CreateBrandCommandValidator(IBrandRepository brandRepository)
    {
        _brandRepository = brandRepository;

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Tên thương hiệu là bắt buộc.")
            .MaximumLength(100)
            .WithMessage("Tên thương hiệu không được vượt quá 100 ký tự.")
            .MustAsync(
                async (name, cancellation) => !await _brandRepository.ExistsByNameAsync(name)
            )
            .WithMessage("Tên thương hiệu đã tồn tại.");

        RuleFor(x => x.Logo)
            .NotNull()
            .WithMessage("Logo thương hiệu là bắt buộc.")
            .Must(file => file.Length > 0)
            .WithMessage("File logo không hợp lệ.")
            .Must(file => file.ContentType.StartsWith("image/"))
            .WithMessage("File phải là định dạng hình ảnh.");
    }
}
