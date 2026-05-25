using MediatR;

public record ResendVerificationEmailCommand : IRequest<ResendVerificationEmailResult>
{
    public int AccountId { get; init; }
}
