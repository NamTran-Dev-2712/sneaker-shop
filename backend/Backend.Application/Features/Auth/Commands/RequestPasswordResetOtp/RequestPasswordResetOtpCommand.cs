using MediatR;

public record RequestPasswordResetOtpCommand : IRequest<RequestPasswordResetOtpResult>
{
    public required string Email { get; init; }
}
