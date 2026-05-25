using FluentValidation;

public class UpdateVoucherCommandValidator : AbstractValidator<UpdateVoucherCommand>
{
    public UpdateVoucherCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id không hợp lệ.");

        RuleFor(x => x.DiscountValue).GreaterThan(0).WithMessage("Giá trị giảm phải lớn hơn 0.");

        RuleFor(x => x.DiscountValue)
            .LessThanOrEqualTo(100)
            .WithMessage("Giá trị giảm theo phần trăm không được vượt quá 100.")
            .When(x => x.DiscountType == DiscountType.PERCENT);

        RuleFor(x => x.MaxDiscount)
            .NotNull()
            .WithMessage("Số tiền giảm tối đa là bắt buộc khi giảm theo phần trăm.")
            .GreaterThan(0)
            .WithMessage("Số tiền giảm tối đa phải lớn hơn 0.")
            .When(x => x.DiscountType == DiscountType.PERCENT);

        RuleFor(x => x.MinOrderTotal)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Giá trị đơn hàng tối thiểu phải >= 0.")
            .When(x => x.MinOrderTotal.HasValue);

        RuleFor(x => x.UsageLimit)
            .GreaterThan(0)
            .WithMessage("Giới hạn sử dụng phải lớn hơn 0.")
            .When(x => x.UsageLimit.HasValue);

        RuleFor(x => x.UsagePerCustomer)
            .GreaterThan(0)
            .WithMessage("Giới hạn sử dụng mỗi khách phải lớn hơn 0.")
            .When(x => x.UsagePerCustomer.HasValue);

        RuleFor(x => x.EndsAt)
            .GreaterThan(x => x.StartsAt)
            .WithMessage("Ngày kết thúc phải sau ngày bắt đầu.")
            .When(x => x.StartsAt.HasValue && x.EndsAt.HasValue);
    }
}
