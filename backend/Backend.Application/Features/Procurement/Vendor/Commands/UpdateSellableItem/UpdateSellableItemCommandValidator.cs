using FluentValidation;

public class UpdateSellableItemCommandValidator : AbstractValidator<UpdateSellableItemCommand>
{
    public UpdateSellableItemCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id không hợp lệ.");

        RuleFor(x => x.VendorId).GreaterThan(0).WithMessage("Vendor Id không hợp lệ.");

        RuleFor(x => x.Price).GreaterThan(0).WithMessage("Giá phải lớn hơn 0.");

        RuleFor(x => x.EffectiveFrom)
            .NotEmpty()
            .WithMessage("Ngày bắt đầu hiệu lực không được để trống.");

        RuleFor(x => x.EffectiveTo)
            .GreaterThan(x => x.EffectiveFrom)
            .WithMessage("Ngày kết thúc phải sau ngày bắt đầu.")
            .When(x => x.EffectiveTo.HasValue);
    }
}
