using MediatR;

public record GetDetailVendorQuery : IRequest<GetDetailVendorResult>
{
    public required int Id { get; init; }
}
