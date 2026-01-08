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
            .WithMessage("Full name can only contain letters and spaces.")
            .NotEmpty()
            .WithMessage("Full name is required.")
            .MaximumLength(255)
            .WithMessage("Full name must not exceed 255 characters.");

        RuleFor(x => x.Email)
            .EmailAddress()
            .WithMessage("Invalid email format.")
            .When(x => !string.IsNullOrEmpty(x.Email))
            .MustAsync(
                async (email, cancellation) =>
                {
                    bool existEmail = await _authRepository.IsEmailExistsAsync(email);
                    return !existEmail;
                }
            )
            .WithMessage("Email already exists.");

        RuleFor(x => x.Phone)
            .NotEmpty()
            .WithMessage("Phone number is required.")
            .Matches(@"^\+?[1-9]\d{1,14}$")
            .WithMessage("Invalid phone number format.")
            .When(x => !string.IsNullOrEmpty(x.Phone))
            .MustAsync(
                async (phone, cancellation) =>
                {
                    bool existPhone = await _authRepository.IsPhoneNumberExistsAsync(phone);
                    return !existPhone;
                }
            )
            .WithMessage("Phone number already exists.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Password is required.")
            .MinimumLength(6)
            .WithMessage("Password must be at least 6 characters long.");

        RuleFor(x => x.Birthday)
            .Must(birthday =>
            {
                if (string.IsNullOrEmpty(birthday))
                    return true;

                return DateTime.TryParse(birthday, out _);
            })
            .WithMessage("Invalid birthday format. Use a valid date string.");
    }
}
