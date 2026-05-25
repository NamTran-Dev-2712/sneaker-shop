using FluentValidation;

public class RequestPasswordResetOtpCommandValidator
    : AbstractValidator<RequestPasswordResetOtpCommand>
{
    public RequestPasswordResetOtpCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email là bắt buộc.")
            .EmailAddress()
            .WithMessage("Định dạng email không hợp lệ.");
    }
}
