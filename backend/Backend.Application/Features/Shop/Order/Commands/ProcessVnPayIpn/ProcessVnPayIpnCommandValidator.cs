using FluentValidation;

public class ProcessVnPayIpnCommandValidator : AbstractValidator<ProcessVnPayIpnCommand>
{
    public ProcessVnPayIpnCommandValidator()
    {
        RuleFor(x => x.QueryParams).NotNull();
    }
}
