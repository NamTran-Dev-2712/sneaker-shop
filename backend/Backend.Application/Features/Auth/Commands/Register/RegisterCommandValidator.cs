using FluentValidation;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public readonly IAuthRepository _authRepository;

    public RegisterCommandValidator(IAuthRepository authRepository)
    {
        _authRepository = authRepository;

        // RuleFor(x => x)
        //     .Must(x => !string.IsNullOrEmpty(x.Email) || !string.IsNullOrEmpty(x.Phone))
        //     .WithMessage("Either Email or Phone must be provided.")
        //     .WithName("ContactMethod"); // Custom name for the rule

        RuleFor(x => x.FullName)
            .Matches(
                @"^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$"
            )
            .WithMessage("Tên chỉ được chứa chữ cái và khoảng trắng.")
            .NotEmpty()
            .WithMessage("Họ và tên là bắt buộc.")
            .MaximumLength(255)
            .WithMessage("Họ và tên không được vượt quá 255 ký tự.");
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email là bắt buộc.")
            .EmailAddress()
            .WithMessage("Định dạng email không hợp lệ.")
            .When(x => !string.IsNullOrEmpty(x.Email))
            .MustAsync(
                async (email, cancellation) =>
                {
                    bool existEmail = await _authRepository.IsEmailExistsAsync(email);
                    return !existEmail;
                }
            )
            .WithMessage("Email đã tồn tại.");

        RuleFor(x => x.Phone)
            .NotEmpty()
            .WithMessage("Số điện thoại là bắt buộc.")
            .Matches(@"^\+?[1-9]\d{1,14}$")
            .WithMessage("Định dạng số điện thoại không hợp lệ.")
            .When(x => !string.IsNullOrEmpty(x.Phone))
            .MustAsync(
                async (phone, cancellation) =>
                {
                    bool existPhone = await _authRepository.IsPhoneNumberExistsAsync(phone);
                    return !existPhone;
                }
            )
            .WithMessage("Số điện thoại đã tồn tại.");

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
            .Matches(@"[\!\?\*\.]")
            .WithMessage("Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!?*.).");

        RuleFor(x => x.Birthday)
            .Must(birthday =>
            {
                if (string.IsNullOrEmpty(birthday))
                    return true;

                return DateTime.TryParse(birthday, out _);
            })
            .WithMessage("Định dạng ngày sinh không hợp lệ. Vui lòng sử dụng chuỗi ngày hợp lệ.");
    }
}
