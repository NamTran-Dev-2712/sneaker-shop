using MediatR;

public record GetDetailVoucherQuery(int Id) : IRequest<GetDetailVoucherResult>;
