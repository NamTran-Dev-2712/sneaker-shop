using FluentValidation;

public class CancelStoreOrderCommandValidator : AbstractValidator<CancelStoreOrderCommand>
{
    public CancelStoreOrderCommandValidator()
    {
        RuleFor(x => x.StoreId).GreaterThan(0);
        RuleFor(x => x.StaffAccountId).GreaterThan(0);
        RuleFor(x => x.OrderId).GreaterThan(0);

        RuleFor(x => x.Reason)
            .MaximumLength(500)
            .WithMessage("Lý do hủy không được vượt quá 500 ký tự.");
    }
}
