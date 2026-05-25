using MediatR;

public record DeleteVendorCommand : IRequest<DeleteVendorResult>
{
    public required int Id { get; init; }
}
