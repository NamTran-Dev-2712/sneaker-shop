using FluentValidation;

public class ShipStoreOrderCommandValidator : AbstractValidator<ShipStoreOrderCommand>
{
    public ShipStoreOrderCommandValidator()
    {
        RuleFor(x => x.StoreId).GreaterThan(0);
        RuleFor(x => x.StaffAccountId).GreaterThan(0);
        RuleFor(x => x.OrderId).GreaterThan(0);
    }
}
