using FluentValidation;

public class CreateAccessoryCommandValidator : AbstractValidator<CreateAccessoryCommand>
{
    public CreateAccessoryCommandValidator()
    {
        RuleFor(x => x.CategoryId).GreaterThan(0).WithMessage("Danh mục không hợp lệ.");

        RuleFor(x => x.BrandId).GreaterThan(0).WithMessage("Thương hiệu không hợp lệ.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Tên sản phẩm không được để trống.")
            .MaximumLength(200)
            .WithMessage("Tên sản phẩm không được vượt quá 200 ký tự.");

        RuleFor(x => x.Description)
            .MaximumLength(2000)
            .WithMessage("Mô tả không được vượt quá 2000 ký tự.")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.MainImage).NotNull().WithMessage("Hình ảnh chính không được để trống.");

        RuleFor(x => x.RetailPrice)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Giá bán lẻ phải >= 0.")
            .When(x => x.RetailPrice.HasValue);

        RuleFor(x => x.OnlinePrice)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Giá online phải >= 0.")
            .When(x => x.OnlinePrice.HasValue);
    }
}
