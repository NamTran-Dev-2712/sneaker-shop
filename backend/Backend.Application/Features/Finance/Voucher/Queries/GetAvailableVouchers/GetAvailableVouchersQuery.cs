using MediatR;

public record GetAvailableVouchersQuery : IRequest<List<GetAvailableVouchersResult>>
{
    public int CustomerId { get; init; }
    public decimal Subtotal { get; init; }
}
