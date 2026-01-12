using FluentValidation;

public class UpdateBrandCommandValidator : AbstractValidator<UpdateBrandCommand>
{
    private readonly IBrandRepository _brandRepository;

    public UpdateBrandCommandValidator(IBrandRepository brandRepository)
    {
        _brandRepository = brandRepository;

        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id không hợp lệ.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Tên thương hiệu là bắt buộc.")
            .MaximumLength(100)
            .WithMessage("Tên thương hiệu không được vượt quá 100 ký tự.")
            .MustAsync(
                async (command, name, cancellation) =>
                    !await _brandRepository.ExistsByNameAsync(name, command.Id)
            )
            .WithMessage("Tên thương hiệu đã tồn tại.");

        When(
            x => x.Logo != null,
            () =>
            {
                RuleFor(x => x.Logo)
                    .Must(file => file!.Length > 0)
                    .WithMessage("File logo không hợp lệ.")
                    .Must(file => file!.ContentType.StartsWith("image/"))
                    .WithMessage("File phải là định dạng hình ảnh.");
            }
        );
    }
}
