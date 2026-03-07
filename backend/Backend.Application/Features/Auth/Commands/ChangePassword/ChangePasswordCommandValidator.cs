using FluentValidation;

public class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
{
    public ChangePasswordCommandValidator()
    {
        RuleFor(x => x.AccountId).GreaterThan(0).WithMessage("Id tài khoản không hợp lệ.");

        RuleFor(x => x.CurrentPassword)
            .NotEmpty()
            .WithMessage("Mật khẩu hiện tại không được để trống.");

        RuleFor(x => x.NewPassword)
            .NotEmpty()
            .WithMessage("Mật khẩu mới không được để trống.")
            .MinimumLength(8)
            .WithMessage("Mật khẩu mới phải có ít nhất 8 ký tự.")
            .Matches("[A-Z]")
            .WithMessage("Mật khẩu mới phải chứa ít nhất 1 chữ hoa.")
            .Matches("[a-z]")
            .WithMessage("Mật khẩu mới phải chứa ít nhất 1 chữ thường.")
            .Matches("[0-9]")
            .WithMessage("Mật khẩu mới phải chứa ít nhất 1 chữ số.")
            .Matches(@"[\!\?\*\.]")
            .WithMessage("Mật khẩu mới phải chứa ít nhất 1 ký tự đặc biệt (!?*).");

        RuleFor(x => x)
            .Must(x => x.NewPassword != x.CurrentPassword)
            .WithMessage("Mật khẩu mới không được trùng với mật khẩu hiện tại.")
            .When(x => !string.IsNullOrEmpty(x.NewPassword));
    }
}
