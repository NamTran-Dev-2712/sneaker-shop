using FluentValidation;

public class MarkStoreOrderPaidCommandValidator : AbstractValidator<MarkStoreOrderPaidCommand>
{
    public MarkStoreOrderPaidCommandValidator()
    {
        RuleFor(x => x.StoreId).GreaterThan(0);
        RuleFor(x => x.StaffAccountId).GreaterThan(0);
        RuleFor(x => x.OrderId).GreaterThan(0);
    }
}
