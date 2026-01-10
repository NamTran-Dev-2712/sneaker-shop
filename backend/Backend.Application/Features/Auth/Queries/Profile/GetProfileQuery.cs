using MediatR;

public record GetProfileQuery : IRequest<ProfileResult>
{
    public required int AccountId { get; init; }
}
