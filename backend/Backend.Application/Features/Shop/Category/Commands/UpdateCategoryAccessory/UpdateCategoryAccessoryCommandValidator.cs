using FluentValidation;

public class UpdateCategoryAccessoryCommandValidator
    : AbstractValidator<UpdateCategoryAccessoryCommand>
{
    public UpdateCategoryAccessoryCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id danh mục không hợp lệ.");

        RuleFor(x => x.Name)
            .MaximumLength(100)
            .WithMessage("Tên danh mục không được vượt quá 100 ký tự.")
            .When(x => !string.IsNullOrEmpty(x.Name));

        RuleForEach(x => x.BrandsToAdd)
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

        RuleForEach(x => x.BrandsToUpdate)
            .ChildRules(brand =>
            {
                brand.RuleFor(b => b.Id).GreaterThan(0).WithMessage("Id thương hiệu không hợp lệ.");

                brand
                    .RuleFor(b => b.Name)
                    .MaximumLength(100)
                    .WithMessage("Tên thương hiệu không được vượt quá 100 ký tự.")
                    .When(b => !string.IsNullOrEmpty(b.Name));
            });
    }
}
