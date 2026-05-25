using MediatR;

public record RefreshTokenCommand : IRequest<RefreshTokenResult>
{
    public required string RefreshToken { get; init; }
}
