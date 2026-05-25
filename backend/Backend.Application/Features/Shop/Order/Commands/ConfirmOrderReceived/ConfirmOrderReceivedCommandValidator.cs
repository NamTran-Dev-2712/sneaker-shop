using FluentValidation;

public class ConfirmOrderReceivedCommandValidator : AbstractValidator<ConfirmOrderReceivedCommand>
{
    public ConfirmOrderReceivedCommandValidator()
    {
        RuleFor(x => x.OrderId).GreaterThan(0);
        RuleFor(x => x.CustomerId).GreaterThan(0);
    }
}
