using MediatR;

public record GetStaffDetailQuery : IRequest<GetStaffDetailResult>
{
    public required int Id { get; init; }
}
