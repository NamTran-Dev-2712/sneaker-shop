using FluentValidation;

public class DeleteCategoryAccessoryCommandValidator
    : AbstractValidator<DeleteCategoryAccessoryCommand>
{
    public DeleteCategoryAccessoryCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id danh mục không hợp lệ.");
    }
}
