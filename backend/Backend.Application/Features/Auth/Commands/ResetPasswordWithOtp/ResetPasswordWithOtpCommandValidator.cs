using FluentValidation;

public class ResetPasswordWithOtpCommandValidator : AbstractValidator<ResetPasswordWithOtpCommand>
{
    public ResetPasswordWithOtpCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email là bắt buộc.")
            .EmailAddress()
            .WithMessage("Định dạng email không hợp lệ.");

        RuleFor(x => x.Otp)
            .NotEmpty()
            .WithMessage("Mã OTP là bắt buộc.")
            .Matches("^[0-9]{6}$")
            .WithMessage("Mã OTP phải gồm 6 chữ số.");

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
    }
}
