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

        RuleFor(x => x.Avatar)
            .Must(file => file == null || file.Length > 0)
            .WithMessage("Tệp ảnh đại diện không hợp lệ.");
    }
}
