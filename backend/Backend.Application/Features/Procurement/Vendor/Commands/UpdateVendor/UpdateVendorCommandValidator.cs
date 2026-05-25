using FluentValidation;

public class UpdateVendorCommandValidator : AbstractValidator<UpdateVendorCommand>
{
    public UpdateVendorCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id không hợp lệ.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Tên nhà cung cấp không được để trống.")
            .MaximumLength(200)
            .WithMessage("Tên nhà cung cấp không được vượt quá 200 ký tự.");

        RuleFor(x => x.Phone)
            .NotEmpty()
            .WithMessage("Số điện thoại không được để trống.")
            .Matches(@"^[0-9]{10,15}$")
            .WithMessage("Số điện thoại không hợp lệ.");

        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email không được để trống.")
            .EmailAddress()
            .WithMessage("Email không hợp lệ.");

        RuleFor(x => x.Address)
            .MaximumLength(500)
            .WithMessage("Địa chỉ không được vượt quá 500 ký tự.")
            .When(x => !string.IsNullOrEmpty(x.Address));
    }
}
