using FluentValidation;

public class DeleteSlideCommandValidator : AbstractValidator<DeleteSlideCommand>
{
    public DeleteSlideCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id slide không hợp lệ.");
    }
}
