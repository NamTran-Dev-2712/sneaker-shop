using FluentValidation;

public class UpdatePurchaseOrderCommandValidator : AbstractValidator<UpdatePurchaseOrderCommand>
{
    public UpdatePurchaseOrderCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("PurchaseOrder Id không hợp lệ.");

        RuleFor(x => x.Items).NotEmpty().WithMessage("Danh sách sản phẩm không được để trống.");

        RuleForEach(x => x.Items)
            .ChildRules(item =>
            {
                item.RuleFor(i => i.SellableItemId)
                    .GreaterThan(0)
                    .WithMessage("SellableItem Id không hợp lệ.");

                item.RuleFor(i => i.Quantity)
                    .GreaterThan(0)
                    .WithMessage("Số lượng phải lớn hơn 0.");

                item.RuleFor(i => i.UnitCost)
                    .GreaterThanOrEqualTo(0)
                    .WithMessage("Giá vốn không được âm.");
            });

        RuleFor(x => x.ExpectedAt)
            .GreaterThan(DateTime.UtcNow)
            .WithMessage("Ngày dự kiến phải trong tương lai.")
            .When(x => x.ExpectedAt.HasValue);
    }
}
