using MediatR;

public record LoginCommand : IRequest<LoginResult>
{
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public required string Password { get; init; }
}
