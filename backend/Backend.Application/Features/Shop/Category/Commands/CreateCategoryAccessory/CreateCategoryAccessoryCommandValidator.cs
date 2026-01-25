using FluentValidation;

public class CreateCategoryAccessoryCommandValidator
    : AbstractValidator<CreateCategoryAccessoryCommand>
{
    public CreateCategoryAccessoryCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Tên danh mục không được để trống.")
            .MaximumLength(100)
            .WithMessage("Tên danh mục không được vượt quá 100 ký tự.");

        RuleForEach(x => x.Brands)
            .ChildRules(brand =>
            {
                brand
                    .RuleFor(b => b.Name)
                    .NotEmpty()
                    .WithMessage("Tên thương hiệu không được để trống.")
                    .MaximumLength(100)
                    .WithMessage("Tên thương hiệu không được vượt quá 100 ký tự.");

                brand
                    .RuleFor(b => b.ThumbnailImage)
                    .NotNull()
                    .WithMessage("Hình ảnh thương hiệu không được để trống.");
            });
    }
}
