using MediatR;

public record ChangePasswordCommand : IRequest<ChangePasswordResult>
{
    public int AccountId { get; init; }
    public string? CurrentPassword { get; init; }
    public required string NewPassword { get; init; }
}
