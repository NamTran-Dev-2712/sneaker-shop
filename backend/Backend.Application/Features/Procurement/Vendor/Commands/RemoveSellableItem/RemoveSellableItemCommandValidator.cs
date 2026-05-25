using FluentValidation;

public class RemoveSellableItemCommandValidator : AbstractValidator<RemoveSellableItemCommand>
{
    public RemoveSellableItemCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id không hợp lệ.");
        RuleFor(x => x.VendorId).GreaterThan(0).WithMessage("Vendor Id không hợp lệ.");
    }
}
