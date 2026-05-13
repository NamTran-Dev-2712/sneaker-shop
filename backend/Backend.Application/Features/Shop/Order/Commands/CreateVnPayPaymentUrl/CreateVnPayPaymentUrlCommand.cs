using MediatR;

public record CreateVnPayPaymentUrlCommand : IRequest<CreateVnPayPaymentUrlResult>
{
    public required int OrderId { get; init; }
    public required int CustomerId { get; init; }
    public required string ClientIp { get; init; }
}
