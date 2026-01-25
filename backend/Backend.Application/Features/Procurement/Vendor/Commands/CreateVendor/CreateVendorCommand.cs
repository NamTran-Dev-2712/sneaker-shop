using MediatR;

public record CreateVendorCommand : IRequest<CreateVendorResult>
{
    public required string Name { get; init; }
    public required string Phone { get; init; }
    public required string Email { get; init; }
    public string? Address { get; init; }
}
