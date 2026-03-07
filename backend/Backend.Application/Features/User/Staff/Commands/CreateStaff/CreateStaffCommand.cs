using MediatR;

public record CreateStaffCommand : IRequest<CreateStaffResult>
{
    public required string Email { get; init; }
    public required string Phone { get; init; }
    public required string FullName { get; init; }
    public required int StoreId { get; init; }
}
