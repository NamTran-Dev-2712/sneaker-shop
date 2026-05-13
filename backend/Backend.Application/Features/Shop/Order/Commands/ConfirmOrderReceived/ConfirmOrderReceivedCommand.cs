using MediatR;

public record ConfirmOrderReceivedCommand : IRequest<ConfirmOrderReceivedResult>
{
    public required int OrderId { get; init; }
    public required int CustomerId { get; init; }
}
