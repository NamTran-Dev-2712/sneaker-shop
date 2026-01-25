using FluentValidation;

public class DeleteAccessoryCommandValidator : AbstractValidator<DeleteAccessoryCommand>
{
    public DeleteAccessoryCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id sản phẩm không hợp lệ.");
    }
}
