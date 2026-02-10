using FluentValidation;

public class GoogleLoginCommandValidator : AbstractValidator<GoogleLoginCommand>
{
    public GoogleLoginCommandValidator()
    {
        RuleFor(x => x.Code).NotEmpty().WithMessage("Authorization code is required.");

        RuleFor(x => x.RedirectUri).NotEmpty().WithMessage("Redirect URI is required.");
    }
}
