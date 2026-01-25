using FluentValidation;

public class UpdateStatusPurchaseOrderCommandValidator
    : AbstractValidator<UpdateStatusPurchaseOrderCommand>
{
    public UpdateStatusPurchaseOrderCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("PurchaseOrder Id không hợp lệ.");

        RuleFor(x => x.NewStatus).IsInEnum().WithMessage("Trạng thái không hợp lệ.");
    }
}
