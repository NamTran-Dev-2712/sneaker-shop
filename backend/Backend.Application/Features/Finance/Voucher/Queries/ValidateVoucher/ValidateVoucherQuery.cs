using MediatR;

public record ValidateVoucherQuery : IRequest<ValidateVoucherResult>
{
    /// <summary>Set by controller from JWT — not from client body.</summary>
    public int CustomerId { get; init; }

    public required string Code { get; init; }

    /// <summary>Sum of all line totals (before shipping, before discount).</summary>
    public required decimal Subtotal { get; init; }
}
