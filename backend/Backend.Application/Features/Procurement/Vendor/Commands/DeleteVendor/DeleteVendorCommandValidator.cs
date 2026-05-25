using FluentValidation;

public class DeleteVendorCommandValidator : AbstractValidator<DeleteVendorCommand>
{
    public DeleteVendorCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id không hợp lệ.");
    }
}
