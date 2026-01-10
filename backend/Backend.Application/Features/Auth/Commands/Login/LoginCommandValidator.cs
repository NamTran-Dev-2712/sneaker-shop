using FluentValidation;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        // email or phone is required
        RuleFor(x => x)
            .Must(x => !string.IsNullOrWhiteSpace(x.Email) || !string.IsNullOrWhiteSpace(x.Phone))
            .WithMessage(
                "Ít nhất một trong hai trường Email hoặc Số điện thoại phải được cung cấp."
            );

        RuleFor(x => x.Email)
            .EmailAddress()
            .WithMessage("Định dạng email không hợp lệ.")
            .When(x => !string.IsNullOrWhiteSpace(x.Email));

        RuleFor(x => x.Phone)
            .Matches(@"^\+?[1-9]\d{1,14}$")
            .WithMessage("Định dạng số điện thoại không hợp lệ.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Mật khẩu là bắt buộc.")
            .MinimumLength(8)
            .WithMessage("Mật khẩu phải có ít nhất 8 ký tự.")
            .Matches(@"[A-Z]")
            .WithMessage("Mật khẩu phải chứa ít nhất một chữ cái viết hoa.")
            .Matches(@"[a-z]")
            .WithMessage("Mật khẩu phải chứa ít nhất một chữ cái viết thường.")
            .Matches(@"[0-9]")
            .WithMessage("Mật khẩu phải chứa ít nhất một chữ số.")
            .Matches(@"[\!\?\*\.\@\#\$\%\^]")
            .WithMessage("Mật khẩu phải chứa ít nhất một ký tự đặc biệt.");
    }
}
