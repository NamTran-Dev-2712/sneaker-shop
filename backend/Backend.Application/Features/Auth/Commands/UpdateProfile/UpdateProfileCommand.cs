using MediatR;

public record UpdateProfileCommand : IRequest<UpdateProfileResult>
{
    public int AccountId { get; init; }
    public required string Email { get; init; }
    public required string Phone { get; init; }
    public string? FullName { get; init; }
    public string? Birthday { get; init; }
}
