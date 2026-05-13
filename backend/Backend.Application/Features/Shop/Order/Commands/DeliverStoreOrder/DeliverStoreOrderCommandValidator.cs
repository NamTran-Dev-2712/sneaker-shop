using FluentValidation;

public class DeliverStoreOrderCommandValidator : AbstractValidator<DeliverStoreOrderCommand>
{
    public DeliverStoreOrderCommandValidator()
    {
        RuleFor(x => x.StoreId).GreaterThan(0);
        RuleFor(x => x.StaffAccountId).GreaterThan(0);
        RuleFor(x => x.OrderId).GreaterThan(0);
    }
}
