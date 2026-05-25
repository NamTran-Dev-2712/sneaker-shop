using FluentValidation;

public class DeletePurchaseOrderCommandValidator : AbstractValidator<DeletePurchaseOrderCommand>
{
    public DeletePurchaseOrderCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("PurchaseOrder Id không hợp lệ.");
    }
}
