using FluentValidation;

public class UpdateProfileCommandValidator : AbstractValidator<UpdateProfileCommand>
{
    public UpdateProfileCommandValidator()
    {
        RuleFor(x => x.AccountId).GreaterThan(0).WithMessage("Id tài khoản không hợp lệ.");

        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email là bắt buộc.")
            .EmailAddress()
            .WithMessage("Định dạng email không hợp lệ.");

        RuleFor(x => x.Phone)
            .NotEmpty()
            .WithMessage("Số điện thoại là bắt buộc.")
            .Matches(@"^[0-9]{10,11}$")
            .WithMessage("Số điện thoại phải có 10-11 chữ số.");

        RuleFor(x => x.FullName)
            .MaximumLength(100)
            .WithMessage("Họ tên không được vượt quá 100 ký tự.")
            .When(x => x.FullName != null);

        RuleFor(x => x.Birthday)
            .Must(birthday =>
            {
                if (string.IsNullOrWhiteSpace(birthday))
                    return true;
                return DateTime.TryParse(birthday, out var date)
                    && date.Year >= 1900
                    && date <= DateTime.UtcNow;
            })
            .WithMessage("Ngày sinh không hợp lệ.")
            .When(x => x.Birthday != null);
    }
}
