using MediatR;

public record GetMyAvailableVouchersQuery(int CustomerId)
    : IRequest<List<GetMyAvailableVouchersResult>>;
