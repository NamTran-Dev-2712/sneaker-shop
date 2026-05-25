using MediatR;

public record CreateStoreCommand : IRequest<CreateStoreResult>
{
    public required string Code { get; init; }
    public required string Name { get; init; }
    public string? Address { get; init; }
    public string? Phone { get; init; }
}
