using MediatR;

/// <summary>
/// Query to get CustomerId from AccountId
/// Used by CartController to identify the customer from JWT token
/// </summary>
public record GetCustomerIdByAccountQuery : IRequest<int?>
{
    public required int AccountId { get; init; }
}
