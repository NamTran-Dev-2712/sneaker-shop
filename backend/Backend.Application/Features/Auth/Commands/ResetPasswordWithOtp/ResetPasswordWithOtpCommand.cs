using MediatR;

public record ResetPasswordWithOtpCommand : IRequest<ResetPasswordWithOtpResult>
{
    public required string Email { get; init; }
    public required string Otp { get; init; }
    public required string NewPassword { get; init; }
}
