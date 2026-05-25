using FluentValidation;

public class UpdateAccessoryCommandValidator : AbstractValidator<UpdateAccessoryCommand>
{
    public UpdateAccessoryCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id sản phẩm không hợp lệ.");

        RuleFor(x => x.CategoryId)
            .GreaterThan(0)
            .WithMessage("Danh mục không hợp lệ.")
            .When(x => x.CategoryId.HasValue);

        RuleFor(x => x.BrandId)
            .GreaterThan(0)
            .WithMessage("Thương hiệu không hợp lệ.")
            .When(x => x.BrandId.HasValue);

        RuleFor(x => x.Name)
            .MaximumLength(200)
            .WithMessage("Tên sản phẩm không được vượt quá 200 ký tự.")
            .When(x => !string.IsNullOrEmpty(x.Name));

        RuleFor(x => x.Description)
            .MaximumLength(2000)
            .WithMessage("Mô tả không được vượt quá 2000 ký tự.")
            .When(x => !string.IsNullOrEmpty(x.Description));

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
