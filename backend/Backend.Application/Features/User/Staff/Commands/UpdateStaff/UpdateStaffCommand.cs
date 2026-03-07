using MediatR;

public record UpdateStaffCommand : IRequest<UpdateStaffResult>
{
    public required int Id { get; init; }
    public required string FullName { get; init; }
    public required int StoreId { get; init; }
    public required bool IsActive { get; init; }
}
