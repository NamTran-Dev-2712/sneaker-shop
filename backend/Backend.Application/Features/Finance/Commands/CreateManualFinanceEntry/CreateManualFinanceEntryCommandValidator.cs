using FluentValidation;

public class CreateManualFinanceEntryCommandValidator
    : AbstractValidator<CreateManualFinanceEntryCommand>
{
    public CreateManualFinanceEntryCommandValidator()
    {
        RuleFor(x => x.Amount).GreaterThan(0).WithMessage("Số tiền phải lớn hơn 0.");

        RuleFor(x => x.Category)
            .NotEmpty()
            .MaximumLength(100)
            .WithMessage("Danh mục không hợp lệ.");

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Mô tả không được vượt quá 1000 ký tự.");
    }
}
