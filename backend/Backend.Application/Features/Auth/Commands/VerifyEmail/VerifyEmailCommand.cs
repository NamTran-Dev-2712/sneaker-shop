using MediatR;

public record VerifyEmailCommand : IRequest<VerifyEmailResult>
{
    public required string Token { get; init; }
}
