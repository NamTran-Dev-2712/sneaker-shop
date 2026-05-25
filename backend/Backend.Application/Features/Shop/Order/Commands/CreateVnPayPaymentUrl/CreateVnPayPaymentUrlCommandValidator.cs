using FluentValidation;

public class CreateVnPayPaymentUrlCommandValidator : AbstractValidator<CreateVnPayPaymentUrlCommand>
{
    public CreateVnPayPaymentUrlCommandValidator()
    {
        RuleFor(x => x.OrderId).GreaterThan(0);
        RuleFor(x => x.CustomerId).GreaterThan(0);
        RuleFor(x => x.ClientIp).NotEmpty().MaximumLength(45);
    }
}
