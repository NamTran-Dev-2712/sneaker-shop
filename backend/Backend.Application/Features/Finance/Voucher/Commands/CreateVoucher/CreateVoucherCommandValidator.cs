using FluentValidation;

public class CreateVoucherCommandValidator : AbstractValidator<CreateVoucherCommand>
{
    public CreateVoucherCommandValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty()
            .WithMessage("Mã voucher không được để trống.")
            .MinimumLength(3)
            .WithMessage("Mã voucher phải có ít nhất 3 ký tự.")
            .MaximumLength(50)
            .WithMessage("Mã voucher không được vượt quá 50 ký tự.")
            .Matches(@"^[A-Z0-9_\-]+$")
            .WithMessage("Mã voucher chỉ được chứa chữ hoa, số, dấu gạch dưới và gạch ngang.");

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
