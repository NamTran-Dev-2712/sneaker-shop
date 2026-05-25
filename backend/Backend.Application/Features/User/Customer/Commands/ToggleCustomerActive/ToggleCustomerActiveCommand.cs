using MediatR;

public record ToggleCustomerActiveCommand(int CustomerId) : IRequest<ToggleCustomerActiveResult>;
