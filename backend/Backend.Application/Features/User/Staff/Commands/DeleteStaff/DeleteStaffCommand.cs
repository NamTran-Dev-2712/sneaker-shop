using MediatR;

public record DeleteStaffCommand : IRequest<DeleteStaffResult>
{
    public required int Id { get; init; }
}
