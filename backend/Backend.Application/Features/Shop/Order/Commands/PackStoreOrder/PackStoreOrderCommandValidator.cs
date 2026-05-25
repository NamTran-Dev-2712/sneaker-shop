using FluentValidation;

public class PackStoreOrderCommandValidator : AbstractValidator<PackStoreOrderCommand>
{
    public PackStoreOrderCommandValidator()
    {
        RuleFor(x => x.StoreId).GreaterThan(0);
        RuleFor(x => x.StaffAccountId).GreaterThan(0);
        RuleFor(x => x.OrderId).GreaterThan(0);
    }
}
