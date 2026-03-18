using FluentValidation;

public class ConfirmStoreOrderCommandValidator : AbstractValidator<ConfirmStoreOrderCommand>
{
    public ConfirmStoreOrderCommandValidator()
    {
        RuleFor(x => x.StoreId).GreaterThan(0);
        RuleFor(x => x.StaffAccountId).GreaterThan(0);
        RuleFor(x => x.OrderId).GreaterThan(0);
    }
}
