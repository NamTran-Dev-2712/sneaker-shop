using FluentValidation;

public class ProcessVnPayReturnCommandValidator : AbstractValidator<ProcessVnPayReturnCommand>
{
    public ProcessVnPayReturnCommandValidator()
    {
        RuleFor(x => x.QueryParams).NotNull();
    }
}
