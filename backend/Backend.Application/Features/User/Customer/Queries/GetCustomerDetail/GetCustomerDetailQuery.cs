using MediatR;

public record GetCustomerDetailQuery(int Id) : IRequest<GetCustomerDetailResult?>;
